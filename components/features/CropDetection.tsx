
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from '../common/Card';
import Button from '../common/Button';
import Loader from '../common/Loader';

const CropDetection: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeCrop = async () => {
        if (!image) return;

        setLoading(true);
        setAnalysis(null);

        try {
            // Fixed: Initialization according to guidelines using process.env.API_KEY directly
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = image.split(',')[1];
            
            // Fixed: Using correct contents structure (object with parts) for multimodal prompt
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                        { text: "Analyze this crop image for diseases. Identify the crop, identify any visible disease or pest issue, provide a confidence level, symptoms observed, and recommended treatment or action. Provide the response in clear Markdown." }
                    ]
                }
            });

            // Fixed: Accessing text as a property on the response object
            setAnalysis(response.text || "No analysis available.");
        } catch (error) {
            console.error("Analysis failed:", error);
            setAnalysis("Failed to analyze image. Please ensure the image is clear and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">AI Crop Health Detector</h1>
            <p className="text-gray-600 dark:text-gray-400">Upload a clear photo of your crop's leaves or affected areas for an instant AI diagnosis.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 min-h-[300px]">
                    {image ? (
                        <div className="w-full flex flex-col items-center">
                            <img src={image} alt="Selected crop" className="max-h-[250px] rounded-lg shadow-md mb-4" />
                            <div className="flex gap-2 w-full">
                                <Button variant="secondary" onClick={() => setImage(null)} className="flex-1">Remove</Button>
                                <Button onClick={analyzeCrop} disabled={loading} className="flex-1">
                                    {loading ? 'Analyzing...' : 'Identify Disease'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-6">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                                <label className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 px-2">
                                    <span>Upload a photo</span>
                                    <input ref={fileInputRef} type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    )}
                </Card>

                <Card className="min-h-[300px]">
                    <h2 className="text-xl font-bold mb-4 text-primary-600">Diagnosis Results</h2>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[200px]">
                            <Loader />
                            <p className="mt-4 text-sm animate-pulse">Consulting AI Agricultural Expert...</p>
                        </div>
                    ) : analysis ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-500 italic text-center">
                            <p>Upload an image and click 'Identify Disease' to see the analysis results here.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CropDetection;
