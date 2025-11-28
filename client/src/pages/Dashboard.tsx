import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Camera, X, Activity, Brain, Trophy, Calendar, Settings, User as UserIcon, Zap } from 'lucide-react';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { usePostureDetection } from '@/hooks/usePostureDetection';
import { auth, getUserProfile, saveDetectionHistory, updateUserXP, saveTaskCompletion } from '@/lib/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import UserOnboarding from '@/components/UserOnboarding';
import UnifiedHeader from '@/components/UnifiedHeader';

// UI Components
const BentoCard = ({ children, className = "", hoverEffect = true }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
    <motion.div
        whileHover={hoverEffect ? { scale: 1.02 } : {}}
        className={`bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

export default function Dashboard() {
    const [, setLocation] = useLocation();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'mood' | 'posture' | 'tasks'>('mood');
    const [cameraActive, setCameraActive] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // AI Hooks
    const {
        currentMood,
        isModelLoaded: moodModelLoaded,
        startDetection: startMoodDetection,
        stopDetection: stopMoodDetection
    } = useFaceDetection(videoRef);

    const {
        currentPosture,
        isModelLoaded: postureModelLoaded,
        startDetection: startPostureDetection,
        stopDetection: stopPostureDetection
    } = usePostureDetection(videoRef);

    // Auth & Profile Loading
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const profile = await getUserProfile(currentUser.uid);
                    if (profile) {
                        setUser({ ...currentUser, ...profile });
                        // Check if onboarding is needed
                        if (!profile.onboardingCompleted) {
                            setShowOnboarding(true);
                        }
                    } else {
                        // New user without profile
                        setUser(currentUser);
                        setShowOnboarding(true);
                    }
                } catch (error) {
                    console.error("Error loading profile:", error);
                }
            } else {
                setLocation('/');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setLocation]);

    // Handle Camera & Detection
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);

                // Start appropriate detection based on tab
                if (activeTab === 'mood') {
                    startMoodDetection();
                } else if (activeTab === 'posture') {
                    startPostureDetection();
                }
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setCameraActive(false);
            stopMoodDetection();
            stopPostureDetection();
        }
    };

    // Switch detection when tab changes
    useEffect(() => {
        if (cameraActive && videoRef.current) {
            if (activeTab === 'mood') {
                stopPostureDetection();
                startMoodDetection();
            } else if (activeTab === 'posture') {
                stopMoodDetection();
                startPostureDetection();
            } else {
                stopMoodDetection();
                stopPostureDetection();
            }
        }
    }, [activeTab, cameraActive]);

    // Save History Periodically (every 5s if confident)
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (cameraActive && user) {
            interval = setInterval(() => {
                if (activeTab === 'mood' && currentMood && currentMood.confidence > 0.7) {
                    saveDetectionHistory(user.uid, 'mood', currentMood);
                } else if (activeTab === 'posture' && currentPosture) {
                    saveDetectionHistory(user.uid, 'posture', currentPosture);
                }
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [cameraActive, user, activeTab, currentMood, currentPosture]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    return (
        <>
            <UnifiedHeader />
            <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome back, <span className="text-orange-500">{user?.displayName?.split(' ')[0] || 'User'}</span>
                        </h1>
                        <p className="text-zinc-400 mt-2">Ready to optimize your wellness today?</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT SIDE: User Profile (30%) */}
                        <div className="lg:col-span-4 space-y-6">
                            <BentoCard className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold text-white">
                                        {user?.displayName?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{user?.displayName || 'User'}</div>
                                        <div className="text-orange-500 font-medium">Level {user?.level || 1}</div>
                                    </div>
                                </div>

                                {/* XP Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-zinc-400">XP Progress</span>
                                        <span className="text-white">{user?.xp || 0} / {((user?.level || 1) * 500)}</span>
                                    </div>
                                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 transition-all duration-500"
                                            style={{ width: `${((user?.xp || 0) % 500) / 5}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                        <div className="text-zinc-500 text-xs">Age</div>
                                        <div className="text-white font-bold">{user?.age || '-'}</div>
                                    </div>
                                    <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                        <div className="text-zinc-500 text-xs">Weight</div>
                                        <div className="text-white font-bold">{user?.weight || '-'} kg</div>
                                    </div>
                                    <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                        <div className="text-zinc-500 text-xs">Height</div>
                                        <div className="text-white font-bold">{user?.height || '-'} cm</div>
                                    </div>
                                    <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                        <div className="text-zinc-500 text-xs">Streak</div>
                                        <div className="text-white font-bold">{user?.streak || 0} 🔥</div>
                                    </div>
                                </div>
                            </BentoCard>

                            {/* Recent Achievements */}
                            <BentoCard className="p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-orange-500" />
                                    Recent Achievements
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white text-sm font-medium">7-Day Streak</div>
                                            <div className="text-zinc-500 text-xs">+100 XP</div>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white text-sm font-medium">10 Tasks Completed</div>
                                            <div className="text-zinc-500 text-xs">+50 XP</div>
                                        </div>
                                    </div>
                                </div>
                            </BentoCard>
                        </div>

                        {/* RIGHT SIDE: Detection Features (70%) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Tab Selector */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setActiveTab('mood')}
                                    className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${activeTab === 'mood'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                                        }`}
                                >
                                    Mood Detection
                                </button>
                                <button
                                    onClick={() => setActiveTab('posture')}
                                    className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${activeTab === 'posture'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                                        }`}
                                >
                                    Posture Detection
                                </button>
                                <button
                                    onClick={() => setActiveTab('tasks')}
                                    className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${activeTab === 'tasks'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                                        }`}
                                >
                                    Tasks
                                </button>
                            </div>

                            {/* Camera View */}
                            {(activeTab === 'mood' || activeTab === 'posture') && (
                                <BentoCard className="relative overflow-hidden" hoverEffect={false}>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                                        {/* Camera Feed (70%) */}
                                        <div className="lg:col-span-2">
                                            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    muted
                                                    playsInline
                                                    className="w-full h-full object-cover"
                                                />

                                                {!cameraActive && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                                        <button
                                                            onClick={startCamera}
                                                            className="px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
                                                        >
                                                            <Camera className="w-5 h-5" />
                                                            Start Camera
                                                        </button>
                                                    </div>
                                                )}

                                                {cameraActive && (
                                                    <button
                                                        onClick={stopCamera}
                                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}

                                                {/* Model Loading Indicator */}
                                                {cameraActive && activeTab === 'mood' && !moodModelLoaded && (
                                                    <div className="absolute top-4 left-4 bg-yellow-500/90 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                                        Loading AI Model...
                                                    </div>
                                                )}
                                                {cameraActive && activeTab === 'posture' && !postureModelLoaded && (
                                                    <div className="absolute top-4 left-4 bg-yellow-500/90 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                                        Loading AI Model...
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Live Detection Results (30%) */}
                                        <div className="space-y-4">
                                            <h3 className="text-white font-semibold text-lg">Live Detection</h3>

                                            {activeTab === 'mood' && currentMood && (
                                                <div className="space-y-3">
                                                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                                                        <div className="text-zinc-500 text-xs mb-2">Current Mood</div>
                                                        <div className="text-2xl font-bold text-white">{currentMood.mood}</div>
                                                        <div className="text-orange-500 text-sm mt-1">{currentMood.confidence.toFixed(1)}% confident</div>
                                                    </div>

                                                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                                                        <div className="text-zinc-500 text-xs mb-3">Expression Breakdown</div>
                                                        <div className="space-y-2">
                                                            {Object.entries(currentMood.expressions).map(([emotion, value]) => (
                                                                <div key={emotion}>
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="text-zinc-400 capitalize">{emotion}</span>
                                                                        <span className="text-white">{(value as number * 100).toFixed(0)}%</span>
                                                                    </div>
                                                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-orange-500 transition-all duration-300"
                                                                            style={{ width: `${(value as number * 100)}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'posture' && currentPosture && (
                                                <div className="space-y-3">
                                                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                                                        <div className="text-zinc-500 text-xs mb-2">Posture Status</div>
                                                        <div className="text-2xl font-bold text-white">{currentPosture.status}</div>
                                                        <div className="text-orange-500 text-sm mt-1">Score: {currentPosture.score}/100</div>
                                                    </div>

                                                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                                                        <div className="text-zinc-500 text-xs mb-3">Detected Issues</div>
                                                        <div className="space-y-2">
                                                            {currentPosture.issues.map((issue, idx) => (
                                                                <div key={idx} className="text-sm text-white bg-zinc-800 rounded-lg p-2">
                                                                    {issue}
                                                                </div>
                                                            ))}
                                                            {currentPosture.issues.length === 0 && (
                                                                <div className="text-sm text-green-500">Perfect posture!</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {!cameraActive && (
                                                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
                                                    <div className="text-zinc-500 text-sm">Start camera to begin detection</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </BentoCard>
                            )}

                            {/* Tasks Tab */}
                            {activeTab === 'tasks' && (
                                <BentoCard className="p-8" hoverEffect={false}>
                                    <h2 className="text-2xl font-bold text-white mb-6">Your Tasks</h2>
                                    <div className="space-y-4">
                                        {[
                                            { title: 'Morning Stretch', xp: 50, completed: true },
                                            { title: 'Posture Check', xp: 30, completed: false },
                                            { title: 'Evening Walk', xp: 40, completed: false }
                                        ].map((task, idx) => (
                                            <div key={idx} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between">
                                                <div>
                                                    <div className="text-white font-medium">{task.title}</div>
                                                    <div className="text-zinc-500 text-sm">+{task.xp} XP</div>
                                                </div>
                                                {task.completed ? (
                                                    <div className="text-green-500 font-semibold">Completed</div>
                                                ) : (
                                                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                                        Complete
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </BentoCard>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* User Onboarding Modal */}
            {showOnboarding && user && (
                <UserOnboarding
                    isOpen={showOnboarding}
                    onComplete={() => {
                        setShowOnboarding(false);
                        // Refresh profile
                        getUserProfile(user.uid).then(profile => {
                            if (profile) setUser({ ...user, ...profile });
                        });
                    }}
                />
            )}
        </>
    );
}
