import React, { useState, useEffect, useRef } from 'react';

import Header from './components/Header';
import ScenarioCard from './components/ScenarioCard';
import Waveform from './components/Waveform';
import AnalysisLoading from './components/AnalysisLoading';
import ResultDashboard from './components/ResultDashboard';
import { SCENARIOS } from './constants';
import { AppState, Scenario, AnalysisResult } from './types';
import { analyzeSpeech } from './services/geminiService';
import { Camera, Mic, Square, Trash2, ArrowLeft, PlayCircle, AlertCircle, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SELECTING_SCENARIO);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<{ message: string; detail: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // 修正箇所：.envファイルからAPIキーを読み込む安全な方式に戻しました
    console.log("API Key loaded:", import.meta.env.VITE_GEMINI_API_KEY ? "Yes (Hidden)" : "No");

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ja-JP';

      recognitionRef.current.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + event.results[i][0].transcript);
          }
        }
      };
    }
  }, []);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsRecording(true);
      setTranscript('');
      setError(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Speech recognition already started or failed to start", e);
        }
      }
    } catch (err: any) {
      let message = 'デバイスへのアクセスに失敗しました。';
      let detail = '設定を確認してください。';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'カメラ・マイクの権限が拒否されました。';
        detail = 'ブラウザのアドレスバーにある鍵アイコンをクリックして、権限を「許可」に変更してから再読み込みしてください。';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'カメラ・マイクが見つかりません。';
        detail = 'デバイスが正しく接続されているか確認してください。';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        message = 'デバイスが使用中です。';
        detail = '他のアプリ（ZoomやMeetなど）がカメラを使用していないか確認してください。';
      }

      setError({ message, detail });
      console.error(err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (transcript.trim().length < 5) {
      setError({
        message: '録音時間が短すぎます。',
        detail: 'もう少し長く話してみてください。内容が少ないと分析ができません。'
      });
    } else {
      handleAnalyze();
    }
  };

  const handleAnalyze = async () => {
    if (!transcript || !selectedScenario) return;

    setState(AppState.ANALYZING);
    try {
      const result = await analyzeSpeech(
        transcript,
        selectedScenario.id,
        selectedScenario.criteria
      );
      setAnalysisResult(result);
      setState(AppState.RESULT);
    } catch (err) {
      setError({
        message: '分析中にエラーが発生しました。',
        detail: 'AIサーバーとの通信に失敗しました。もう一度試してください。'
      });
      setState(AppState.RECORDING);
    }
  };

  const reset = () => {
    setState(AppState.SELECTING_SCENARIO);
    setSelectedScenario(null);
    setIsRecording(false);
    setTranscript('');
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            </div>
            <div className="flex-grow">
              <p className="font-bold text-red-800">{error.message}</p>
              <p className="text-sm text-red-600 mt-1">{error.detail}</p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => setError(null)}
                  className="text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  閉じる
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  ページを更新する
                </button>
              </div>
            </div>
          </div>
        )}

        {state === AppState.SELECTING_SCENARIO && (
          <div className="animate-in fade-in duration-700">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
                どんな場面の練習をしますか？
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                場面に合わせて最適な評価項目を切り替えます。気になるシチュエーションを選んで練習を始めましょう。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCENARIOS.map(scenario => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onClick={() => {
                    setSelectedScenario(scenario);
                    setState(AppState.RECORDING);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {state === AppState.RECORDING && selectedScenario && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
            <button
              onClick={() => setState(AppState.SELECTING_SCENARIO)}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              場面選択に戻る
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
              <div className="bg-slate-800 aspect-video relative flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${!isRecording ? 'hidden' : ''}`}
                />
                {!isRecording && (
                  <div className="text-center text-slate-400 p-10">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">準備ができたらボタンを押して開始してください</p>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <div className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
                    {selectedScenario.title} モード
                  </div>
                </div>
                {isRecording && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%]">
                    <Waveform stream={stream} isActive={isRecording} />
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex flex-col items-center gap-6">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95"
                    >
                      <PlayCircle className="w-7 h-7" />
                      録音・録画を開始
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 w-full">
                      <button
                        onClick={stopRecording}
                        className="flex-grow flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-red-200 transition-all active:scale-95"
                      >
                        <Square className="w-6 h-6" />
                        録音を停止して分析
                      </button>
                      <button
                        onClick={() => {
                          setIsRecording(false);
                          if (stream) stream.getTracks().forEach(t => t.stop());
                          setStream(null);
                        }}
                        className="p-5 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors"
                        title="キャンセル"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  )}

                  <div className="w-full">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">評価されるポイント</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedScenario.criteria.map((c, i) => (
                        <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-sm font-medium">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>

                  {transcript && (
                    <div className="w-full mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">リアルタイム文字起こし</h4>
                        {isRecording && (
                          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                        )}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed max-h-32 overflow-y-auto italic">
                        「 {transcript} 」
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {state === AppState.ANALYZING && (
          <AnalysisLoading />
        )}

        {state === AppState.RESULT && analysisResult && (
          <ResultDashboard
            result={analysisResult}
            onReset={reset}
          />
        )}
      </main>

      <footer className="py-8 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© 2025 Talk Advisor AI - Powered by Gemini 3</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600">プライバシーポリシー</a>
            <a href="#" className="hover:text-blue-600">利用規約</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;