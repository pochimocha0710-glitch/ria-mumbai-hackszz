import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase.config';

interface UserOnboardingProps {
    isOpen: boolean;
    onComplete: () => void;
}

export default function UserOnboarding({ isOpen, onComplete }: UserOnboardingProps) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        age: '',
        height: '',
        weight: '',
        location: '',
        diseases: [] as string[],
        goals: [] as string[]
    });

    const diseaseOptions = ['None', 'Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Heart Disease'];
    const goalOptions = ['Better Posture', 'Mental Clarity', 'Gym Consistency', 'Deep Sleep', 'Stress Management', 'Healthy Eating'];

    const handleSubmit = async () => {
        if (!user) return;

        try {
            await setDoc(doc(db, 'users', user.uid), {
                ...formData,
                age: parseInt(formData.age),
                height: parseInt(formData.height),
                weight: parseInt(formData.weight),
                xp: 0,
                level: 1,
                tasksCompleted: 0,
                streak: 0,
                onboardingCompleted: true,
                createdAt: new Date()
            }, { merge: true });

            onComplete();
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    };

    const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
        if (array.includes(item)) {
            setter(array.filter(i => i !== item));
        } else {
            setter([...array, item]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-zinc-800 p-6 border-b border-zinc-700">
                    <h2 className="text-2xl font-bold text-white">Welcome to Ria!</h2>
                    <p className="text-zinc-400 mt-1">Let's personalize your wellness journey</p>
                    <div className="mt-4 flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-orange-500' : 'bg-zinc-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                            <div>
                                <label className="text-sm font-medium text-zinc-400 block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-zinc-400 block mb-2">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="25"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-zinc-400 block mb-2">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="170"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-zinc-400 block mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="70"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-zinc-400 block mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="New York, USA"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white mb-4">Health Information</h3>
                            <div>
                                <label className="text-sm font-medium text-zinc-400 block mb-3">Do you have any health conditions?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {diseaseOptions.map((disease) => (
                                        <button
                                            key={disease}
                                            onClick={() => toggleArrayItem(formData.diseases, disease, (val) => setFormData({ ...formData, diseases: val }))}
                                            className={`p-3 rounded-xl border transition-all text-left ${formData.diseases.includes(disease)
                                                    ? 'bg-orange-500/20 border-orange-500 text-white'
                                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                                                }`}
                                        >
                                            {disease}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white mb-4">Your Goals</h3>
                            <div>
                                <label className="text-sm font-medium text-zinc-400 block mb-3">What would you like to improve?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {goalOptions.map((goal) => (
                                        <button
                                            key={goal}
                                            onClick={() => toggleArrayItem(formData.goals, goal, (val) => setFormData({ ...formData, goals: val }))}
                                            className={`p-3 rounded-xl border transition-all text-left ${formData.goals.includes(goal)
                                                    ? 'bg-orange-500/20 border-orange-500 text-white'
                                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                                                }`}
                                        >
                                            {goal}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-zinc-800 p-6 border-t border-zinc-700 flex justify-between">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 bg-zinc-700 text-white rounded-xl hover:bg-zinc-600 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (step < 3) {
                                setStep(step + 1);
                            } else {
                                handleSubmit();
                            }
                        }}
                        className="ml-auto px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                    >
                        {step === 3 ? 'Complete' : 'Next'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
