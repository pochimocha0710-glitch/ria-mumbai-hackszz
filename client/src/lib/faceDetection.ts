import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | null = null;

export async function initializeFaceDetector() {
    if (faceLandmarker) return faceLandmarker;

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true
    });

    return faceLandmarker;
}

export interface FaceLandmark {
    x: number;
    y: number;
    z: number;
}

export type MoodType = 'Happy' | 'Neutral' | 'Sad' | 'Stressed' | 'Analyzing...';

export interface MoodResult {
    mood: MoodType;
    confidence: number;
    isSmiling: boolean;
    encouragement: string;
}

export async function detectFace(videoElement: HTMLVideoElement, timestamp: number) {
    if (!faceLandmarker) {
        await initializeFaceDetector();
    }

    if (!faceLandmarker) return null;

    const result = await faceLandmarker.detectForVideo(videoElement, timestamp);
    return result;
}

export function detectSmile(landmarks: FaceLandmark[]): boolean {
    if (!landmarks || landmarks.length < 468) return false;

    // Key landmarks for smile detection
    // Mouth corners: 61 (left), 291 (right)
    // Upper lip center: 13
    // Lower lip center: 14
    // Nose tip: 1

    const leftMouthCorner = landmarks[61];
    const rightMouthCorner = landmarks[291];
    const upperLipCenter = landmarks[13];
    const lowerLipCenter = landmarks[14];
    const noseTip = landmarks[1];

    // Calculate mouth width
    const mouthWidth = Math.sqrt(
        Math.pow(rightMouthCorner.x - leftMouthCorner.x, 2) +
        Math.pow(rightMouthCorner.y - leftMouthCorner.y, 2)
    );

    // Calculate mouth height
    const mouthHeight = Math.sqrt(
        Math.pow(upperLipCenter.x - lowerLipCenter.x, 2) +
        Math.pow(upperLipCenter.y - lowerLipCenter.y, 2)
    );

    // Calculate mouth corners elevation (smiling raises corners)
    const mouthCenterY = (leftMouthCorner.y + rightMouthCorner.y) / 2;
    const mouthCornerElevation = noseTip.y - mouthCenterY;

    // Smile detection criteria:
    // 1. Mouth width to height ratio increases when smiling
    // 2. Mouth corners are elevated relative to nose
    const widthToHeightRatio = mouthWidth / mouthHeight;
    const isSmiling = widthToHeightRatio > 3.5 && mouthCornerElevation > 0.05;

    return isSmiling;
}

export function classifyMood(landmarks: FaceLandmark[], blendshapes?: any): MoodType {
    if (!landmarks || landmarks.length < 468) return 'Analyzing...';

    const isSmiling = detectSmile(landmarks);

    // Additional mood indicators
    const leftEyebrow = landmarks[70];
    const rightEyebrow = landmarks[300];
    const noseTip = landmarks[1];
    const chin = landmarks[152];

    // Calculate eyebrow position (lower = stressed/sad, higher = happy/neutral)
    const eyebrowHeight = (leftEyebrow.y + rightEyebrow.y) / 2;
    const faceHeight = Math.abs(noseTip.y - chin.y);
    const eyebrowRatio = (noseTip.y - eyebrowHeight) / faceHeight;

    // Use blendshapes if available for more accurate emotion detection
    if (blendshapes && blendshapes.length > 0) {
        const shapes = blendshapes[0].categories;
        const smileScore = shapes.find((s: any) => s.categoryName === 'mouthSmile')?.score || 0;
        const frownScore = shapes.find((s: any) => s.categoryName === 'mouthFrown')?.score || 0;

        if (smileScore > 0.3) return 'Happy';
        if (frownScore > 0.3) return 'Sad';
    }

    // Fallback to landmark-based detection
    if (isSmiling) {
        return 'Happy';
    } else if (eyebrowRatio < 0.3) {
        return 'Stressed';
    } else if (eyebrowRatio < 0.4) {
        return 'Sad';
    } else {
        return 'Neutral';
    }
}

export function generateEncouragement(mood: MoodType): string {
    const encouragements = {
        'Happy': [
            "🌟 Amazing! Your smile is beautiful! Keep that positive energy flowing!",
            "😊 You're glowing! That smile looks great on you!",
            "✨ Wonderful! Your happiness is contagious!",
            "🎉 Perfect! You're radiating positive vibes!"
        ],
        'Neutral': [
            "😊 Try giving us a smile! Even a forced smile releases endorphins!",
            "🌈 Come on, you can do it! A smile can change your whole mood!",
            "💪 Let's see that smile! Your brain will thank you for it!",
            "✨ Smile for me! It's scientifically proven to boost your mood!"
        ],
        'Sad': [
            "🤗 I know it might be hard, but try smiling! It really helps!",
            "💙 Even a small smile can make a difference. You've got this!",
            "🌸 Smiling releases serotonin - give it a try, even if you don't feel like it!",
            "🌟 Your smile matters! Let's turn that frown upside down!"
        ],
        'Stressed': [
            "🧘 Take a deep breath and smile! It'll help reduce stress hormones!",
            "💆 Relax those facial muscles and smile! You're doing great!",
            "🌺 A smile can lower cortisol levels. Give it a try!",
            "✨ Let go of that tension with a smile! You deserve to feel better!"
        ],
        'Analyzing...': [
            "👀 Looking at your expression...",
            "🔍 Analyzing your mood...",
            "⏳ Just a moment, reading your face..."
        ]
    };

    const messages = encouragements[mood] || encouragements['Neutral'];
    return messages[Math.floor(Math.random() * messages.length)];
}

export function analyzeMood(landmarks: FaceLandmark[], blendshapes?: any): MoodResult {
    const mood = classifyMood(landmarks, blendshapes);
    const isSmiling = detectSmile(landmarks);

    // Calculate confidence based on landmark quality
    const confidence = landmarks.length >= 468 ? 0.85 : 0.5;

    return {
        mood,
        confidence,
        isSmiling,
        encouragement: generateEncouragement(mood)
    };
}

// Educational content about smiling benefits
export const smilingBenefits = [
    {
        title: "Releases Endorphins",
        description: "Smiling triggers the release of endorphins, your body's natural feel-good chemicals.",
        icon: "🧠"
    },
    {
        title: "Reduces Stress",
        description: "Even forced smiling can lower cortisol levels and reduce stress hormones.",
        icon: "😌"
    },
    {
        title: "Boosts Immune System",
        description: "Positive emotions from smiling can strengthen your immune response.",
        icon: "💪"
    },
    {
        title: "Improves Mood",
        description: "The physical act of smiling sends signals to your brain that you're happy.",
        icon: "🌈"
    },
    {
        title: "Contagious Positivity",
        description: "Your smile can trigger mirror neurons in others, spreading happiness.",
        icon: "✨"
    },
    {
        title: "Lowers Blood Pressure",
        description: "Smiling and laughing can help reduce blood pressure and improve heart health.",
        icon: "❤️"
    }
];
