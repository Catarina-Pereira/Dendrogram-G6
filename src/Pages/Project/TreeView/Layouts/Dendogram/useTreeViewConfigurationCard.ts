import * as React from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MockVisualizationService } from "../../../../../Services/Visualization/MockVisualizationService"

interface UseTreeViewConfigurationProps {
    onGenerateTreeView: () => void;
}


/**
 * Hook for the UseTreeViewConfigurationCard page.
 */
export function useTreeViewConfigurationCard({ onGenerateTreeView }: UseTreeViewConfigurationProps) {

    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const navigate = useNavigate()

    return {
        file,
        isUploading,
        handleFileChange: (file: React.SetStateAction<File | null>) => setFile(file),
        handleCancel: () => navigate(-1),
        handleSubmit: async () => {
            if (!file) {
                setError("Please select a file to upload.")
                return
            }

            try {
                setIsUploading(true);

                const newickText = await file.text();
                if (!newickText.trim()) {
                    setError("The select file is empty.");
                    setIsUploading(false);
                    return;
                }

                MockVisualizationService.saveUPGMATreeState(newickText, file.name);
                onGenerateTreeView();
            } catch (err: any) {
                setError(err.message ?? 'An error occorred while reading the file.')
            }
        },
        error,
        clearError: () => setError(null)
    }
}