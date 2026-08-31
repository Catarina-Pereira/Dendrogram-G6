import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MockVisualizationService } from "../../../Services/Visualization/MockVisualizationService"

interface TreeViewNewickLoaderCard {
    onGenerateTreeView: () => void;
}


/**
 * Hook for the TreeViewNewickLoaderCard page.
 */
export function TreeViewNewickLoaderCard({ onGenerateTreeView }: TreeViewNewickLoaderCard) {

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
                setError(err.message ?? "An error occurred while reading the file.")
            }
        },
        error,
        clearError: () => setError(null)
    }
}
