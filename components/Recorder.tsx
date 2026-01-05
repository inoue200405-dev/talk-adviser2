
import React, { useState, useRef, useCallback } from 'react';
import { MediaData } from '../types';
import { blobToBase64 } from '../services/geminiService';

interface RecorderProps {
  onMediaCaptured: (media: MediaData) => void;
}

const Recorder: React.FC<RecorderProps> = ({ onMediaCaptured }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video'>('video');
  const [time, setTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // サポートされているMIMEタイプを取得する関数
  const getSupportedMimeType = (type: 'audio' | 'video') => {
    const types = type === 'video' 
      ? ['video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']
      : ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp3', 'audio/mp4'];
    
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        console.log(`Using supported MIME type: ${t}`);
        return t;
      }
    }
    console.warn('No optimal MIME type found, letting browser decide.');
    return ''; // ブラウザのデフォルトに任せる
  };

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: recordingType === 'video'
      };
      
      console.log('Requesting user media with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current && recordingType === 'video') {
        videoRef.current.srcObject = stream;
      }

      const mimeType = getSupportedMimeType(recordingType);
      const options = mimeType ? { mimeType } : undefined;
      console.log(`Creating MediaRecorder with options:`, options);

      const recorder = new MediaRecorder(stream, options);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        alert(`録音中にエラーが発生しました: ${(e as any).error?.message || 'Unknown error'}`);
      };

      recorder.onstop = async () => {
        try {
          console.log('Recording stopped. Processing chunks...');
          const blobType = chunks.length > 0 ? chunks[0].type : (recordingType === 'video' ? 'video/webm' : 'audio/webm');
          const blob = new Blob(chunks, { type: blobType });
          console.log(`Created blob: type=${blob.type}, size=${blob.size}`);
          
          const base64 = await blobToBase64(blob);
          onMediaCaptured({
            blob,
            type: recordingType,
            base64
          });
          
          // Cleanup stream
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          console.error("Error processing recording:", err);
          alert("録音データの処理中にエラーが発生しました。");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setTime(0);
      timerRef.current = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Error starting recording:", err);
      const msg = err.name === 'NotAllowedError' 
        ? "カメラまたはマイクのアクセスが拒否されました。" 
        : `録画の開始に失敗しました: ${err.message || err.name}`;
      alert(msg);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">録画・録音</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setRecordingType('video')}
            disabled={isRecording}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              recordingType === 'video' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ビデオ
          </button>
          <button
            onClick={() => setRecordingType('audio')}
            disabled={isRecording}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              recordingType === 'audio' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            音声のみ
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
        {recordingType === 'video' ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${!isRecording && 'opacity-30'}`}
          />
        ) : (
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-gray-800 mb-4 ${isRecording ? 'animate-pulse' : ''}`}>
              <i className="fas fa-microphone text-3xl text-blue-400"></i>
            </div>
            <p className="text-gray-400 text-sm">音声録音モード</p>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-mono">{formatTime(time)}</span>
          </div>
        )}

        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-lg font-medium opacity-60">
              {recordingType === 'video' ? 'カメラを起動してください' : '録音を開始してください'}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="group flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-1"
          >
            <i className="fas fa-circle text-sm group-hover:scale-110 transition-transform"></i>
            <span>開始する</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-red-200 transition-all"
          >
            <i className="fas fa-stop text-sm"></i>
            <span>終了する</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Recorder;
