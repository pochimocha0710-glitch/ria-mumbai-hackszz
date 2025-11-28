import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Smile, Activity } from "lucide-react";
import {
    initializeFaceDetector,
    detectFace,
    analyzeMood,
    type MoodType,
    type MoodResult
} from "@/lib/faceDetection";
import {
    initializePoseDetector,
    detectPose,
    type PoseLandmark
} from "@/lib/poseDetection";

interface CameraToolsProps {
    activeTab: 'mood' | 'posture';
    setActiveTab: (tab: 'mood' | 'posture') => void;
}

interface HistoryEntry {
    time: string;
    label: string;
    type: 'mood' | 'posture';
}

export default function CameraTools({ activeTab, setActiveTab }: CameraToolsProps) {
    const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<string>("Not active");
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        // Initialize both detectors
        Promise.all([
            initializeFaceDetector(),
            initializePoseDetector()
        ]).then(() => {
            setIsModelLoaded(true);
        });

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setCameraPermission('granted');
        } catch (error) {
            setCameraPermission('denied');
        }
    };

    const analyzeMoodFrame = async () => {
        const videoElement = webcamRef.current?.video;
        if (!videoElement || !canvasRef.current || !isAnalyzing || activeTab !== 'mood') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const timestamp = performance.now();
        const result = await detectFace(videoElement, timestamp);

        if (result && result.faceLandmarks && result.faceLandmarks.length > 0) {
            const landmarks = result.faceLandmarks[0];
            const blendshapes = result.faceBlendshapes;

            // Draw face mesh
            ctx.fillStyle = '#3b82f6';
            landmarks.forEach((landmark: any) => {
                ctx.beginPath();
                ctx.arc(
                    landmark.x * canvas.width,
                    landmark.y * canvas.height,
                    1,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
            });

            const mood = analyzeMood(landmarks, blendshapes);
            setCurrentStatus(mood.mood + (mood.isSmiling ? ' (Smiling)' : ''));

            // Update history
            const now = new Date();
            const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setHistory(prev => {
                const lastEntry = prev[prev.length - 1];
                if (!lastEntry || lastEntry.time !== currentTime || lastEntry.label !== mood.mood) {
                    return [...prev.slice(-9), { time: currentTime, label: mood.mood, type: 'mood' }];
                }
                return prev;
            });
        }

        animationFrameRef.current = requestAnimationFrame(analyzeMoodFrame);
    };

    const analyzePostureFrame = async () => {
        const videoElement = webcamRef.current?.video;
        if (!videoElement || !canvasRef.current || !isAnalyzing || activeTab !== 'posture') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const timestamp = performance.now();
        const result = await detectPose(videoElement, timestamp);

        if (result && result.landmarks && result.landmarks.length > 0) {
            const landmarks = result.landmarks[0];

            // Draw skeleton
            const connections = [
                [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
                [11, 23], [12, 24], [23, 24],
                [23, 25], [25, 27], [24, 26], [26, 28],
            ];

            connections.forEach(([start, end]) => {
                const startPoint = landmarks[start];
                const endPoint = landmarks[end];

                ctx.beginPath();
                ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
                ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 3;
                ctx.stroke();
            });

            landmarks.forEach((landmark: PoseLandmark) => {
                ctx.beginPath();
                ctx.arc(
                    landmark.x * canvas.width,
                    landmark.y * canvas.height,
                    5,
                    0,
                    2 * Math.PI
                );
                ctx.fillStyle = '#3b82f6';
                ctx.fill();
            });

            // Simple posture analysis
            const leftShoulder = landmarks[11];
            const rightShoulder = landmarks[12];
            const leftHip = landmarks[23];
            const rightHip = landmarks[24];

            const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
            const hipMidY = (leftHip.y + rightHip.y) / 2;
            const torsoAngle = Math.abs(shoulderMidY - hipMidY);

            const postureStatus = torsoAngle > 0.3 ? "Good posture" : "Slouching - sit upright";
            setCurrentStatus(postureStatus);

            // Update history
            const now = new Date();
            const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setHistory(prev => {
                const lastEntry = prev[prev.length - 1];
                if (!lastEntry || lastEntry.time !== currentTime || lastEntry.label !== postureStatus) {
                    return [...prev.slice(-9), { time: currentTime, label: postureStatus, type: 'posture' }];
                }
                return prev;
            });
        }

        animationFrameRef.current = requestAnimationFrame(analyzePostureFrame);
    };

    const startAnalysis = () => {
        setIsAnalyzing(true);
        setHistory([]);
        if (activeTab === 'mood') {
            analyzeMoodFrame();
        } else {
            analyzePostureFrame();
        }
    };

    const stopAnalysis = () => {
        setIsAnalyzing(false);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    useEffect(() => {
        if (isAnalyzing) {
            stopAnalysis();
            setTimeout(() => {
                if (activeTab === 'mood') {
                    analyzeMoodFrame();
                } else {
                    analyzePostureFrame();
                }
            }, 100);
        }
    }, [activeTab]);

    const getMoodEmoji = (mood: string) => {
        if (mood.includes('Happy')) return '😊';
        if (mood.includes('Neutral')) return '😐';
        if (mood.includes('Sad')) return '😢';
        if (mood.includes('Stressed')) return '😰';
        return '🤔';
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden h-[calc(100vh-16rem)] flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-zinc-900">
                <button
                    onClick={() => setActiveTab('mood')}
                    className={`flex-1 px-4 py-3 font-semibold transition-colors ${activeTab === 'mood'
                        ? 'bg-orange-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                >
                    <Smile className="w-5 h-5 inline mr-2" />
                    Mood Detector
                </button>
                <button
                    onClick={() => setActiveTab('posture')}
                    className={`flex-1 px-4 py-3 font-semibold transition-colors ${activeTab === 'posture'
                        ? 'bg-orange-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                >
                    <Activity className="w-5 h-5 inline mr-2" />
                    Posture Detector
                </button>
            </div>

            {/* Camera Preview */}
            <div className="relative aspect-video bg-black">
                {cameraPermission === 'granted' ? (
                    <>
                        <Webcam
                            ref={webcamRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            videoConstraints={{ facingMode: 'user' }}
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                        />

                        {/* Live Status Overlay */}
                        <AnimatePresence>
                            {isAnalyzing && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2"
                                >
                                    <div className="bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg border border-orange-500">
                                        <div className="font-bold text-lg">{currentStatus}</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <Camera className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Camera Access Required
                            </h3>
                            <p className="text-zinc-400 mb-6 max-w-sm">
                                We need camera access to analyze your {activeTab === 'mood' ? 'facial expressions' : 'posture'}
                            </p>
                            <button
                                onClick={handleCameraPermission}
                                className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
                            >
                                Enable Camera
                            </button>
                        </div>
                    </div>
                )}

                {!isModelLoaded && (
                    <div className="absolute top-4 left-4 bg-yellow-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Loading AI Model...
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-white/10 bg-zinc-900">
                <button
                    onClick={isAnalyzing ? stopAnalysis : startAnalysis}
                    disabled={!isModelLoaded || cameraPermission !== 'granted'}
                    className={`w-full py-3 rounded-full font-semibold transition-all ${isAnalyzing
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
                </button>
            </div>

            {/* History */}
            <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Recent Detections</h3>
                {history.length > 0 ? (
                    <div className="space-y-2">
                        {history.map((entry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2"
                            >
                                <span className="text-white/60">{entry.time}</span>
                                <span className="text-white font-medium flex items-center gap-2">
                                    {entry.type === 'mood' && <span>{getMoodEmoji(entry.label)}</span>}
                                    {entry.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white/40 text-sm text-center py-4">
                        Start analysis to see detection history
                    </p>
                )}
            </div>
        </div>
    );
}
