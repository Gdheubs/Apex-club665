import React, { useState, useRef, useEffect, useCallback } from 'react';

const VideoRecordingPage = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordings, setRecordings] = useState([]);
    const [error, setError] = useState(null);
    const [stream, setStream] = useState(null);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    // Cleanup media stream
    const cleanupStream = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, [stream]);

    useEffect(() => {
        // Request camera and microphone permissions
        const setupMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setError(null);
            } catch (err) {
                setError('Failed to access camera and microphone. Please check your permissions.');
                console.error('Media access error:', err);
            }
        };

        setupMedia();

        // Cleanup function
        return cleanupStream;
    }, [cleanupStream]);

    // Add protection against screenshots and recordings
    useEffect(() => {
        const preventCapture = (e) => {
            e.preventDefault();
            return false;
        };

        document.addEventListener('contextmenu', preventCapture);
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'PrintScreen' ||
                (e.ctrlKey && e.key === 'p') ||
                (e.metaKey && e.shiftKey && e.key === '3') ||
                (e.metaKey && e.shiftKey && e.key === '4')
            ) {
                preventCapture(e);
            }
        });

        return () => {
            document.removeEventListener('contextmenu', preventCapture);
            document.removeEventListener('keydown', preventCapture);
        };
    }, []);

    const startRecording = () => {
        if (!stream) return;

        chunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString();
            setRecordings(prev => [...prev, {
                id: timestamp,
                url,
                timestamp,
                duration: recordingTime
            }]);
            setRecordingTime(0);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        setIsPaused(false);

        // Start timer
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            clearInterval(timerRef.current);
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Recording Area */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <h2 className="heading-secondary mb-6">Video Recording</h2>
                            
                            {error ? (
                                <div className="bg-red-900/50 text-red-300 p-4 rounded-lg mb-4">
                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                    {error}
                                </div>
                            ) : (
                                <>
                                    {/* Video Preview */}
                                    <div className="relative aspect-video mb-6 bg-apex-gray rounded-lg overflow-hidden">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover protected-content"
                                        />
                                        
                                        {/* Recording Indicator */}
                                        {isRecording && (
                                            <div className="absolute top-4 left-4 flex items-center bg-black/75 px-3 py-1 rounded-full">
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                                                <span className="text-sm">{formatTime(recordingTime)}</span>
                                            </div>
                                        )}

                                        {/* Watermark */}
                                        <div className="absolute bottom-4 right-4 text-white/50 font-display text-sm">
                                            APEX CLUB
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex justify-center space-x-4">
                                        {!isRecording ? (
                                            <button
                                                onClick={startRecording}
                                                className="btn-primary flex items-center"
                                            >
                                                <i className="fas fa-circle text-red-500 mr-2"></i>
                                                Start Recording
                                            </button>
                                        ) : (
                                            <>
                                                {!isPaused ? (
                                                    <button
                                                        onClick={pauseRecording}
                                                        className="btn-secondary flex items-center"
                                                    >
                                                        <i className="fas fa-pause mr-2"></i>
                                                        Pause
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={resumeRecording}
                                                        className="btn-secondary flex items-center"
                                                    >
                                                        <i className="fas fa-play mr-2"></i>
                                                        Resume
                                                    </button>
                                                )}
                                                <button
                                                    onClick={stopRecording}
                                                    className="btn-primary flex items-center bg-red-500 hover:bg-red-600"
                                                >
                                                    <i className="fas fa-stop mr-2"></i>
                                                    Stop
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Recording History */}
                    <div className="lg:col-span-1">
                        <div className="card">
                            <h3 className="text-xl font-display font-semibold mb-4">Recording History</h3>
                            
                            {recordings.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">
                                    <i className="fas fa-film text-4xl mb-2"></i>
                                    <p>No recordings yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recordings.map((recording) => (
                                        <div
                                            key={recording.id}
                                            className="bg-apex-gray/50 rounded-lg p-4 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(recording.timestamp).toLocaleTimeString()}
                                                </p>
                                                <p className="text-sm">
                                                    Duration: {formatTime(recording.duration)}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <a
                                                    href={recording.url}
                                                    download={`recording-${recording.id}.webm`}
                                                    className="text-apex-gold hover:text-apex-gold/80 transition-colors"
                                                >
                                                    <i className="fas fa-download"></i>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Privacy Notice */}
                        <div className="mt-6 p-4 bg-apex-gray/30 rounded-lg">
                            <h4 className="text-apex-gold font-semibold mb-2">
                                <i className="fas fa-shield-alt mr-2"></i>
                                Privacy Protection
                            </h4>
                            <p className="text-sm text-gray-400">
                                Your recordings are protected by our advanced security measures. 
                                Screenshots and screen recordings are disabled to protect your content.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoRecordingPage;