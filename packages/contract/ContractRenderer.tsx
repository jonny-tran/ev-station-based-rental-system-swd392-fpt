"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { ContractData } from "./contract-types";
import { ContractGenerator } from "./contract-generator";
import { CONTRACT_TEMPLATE } from "./contract-template";

interface ContractRendererProps {
  contractData: ContractData;
  onRefresh?: () => void;
}

export function ContractRenderer({
  contractData,
  onRefresh,
}: ContractRendererProps) {
  const [contractHtml, setContractHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Load contract template when contractData changes (only contractId to avoid infinite loop)
  useEffect(() => {
    if (!contractData) {
      setRenderError("Contract data is missing");
      setContractHtml("");
      return;
    }

    const loadContractTemplate = async () => {
      setIsLoading(true);
      try {
        // Validate contractData before using
        if (typeof contractData !== "object") {
          throw new Error("Invalid contractData: must be an object");
        }

        // Use the template from TypeScript file
        const generator = new ContractGenerator(CONTRACT_TEMPLATE);
        const generatedHtml = generator.generateContract(contractData);

        // Validate generated HTML
        if (!generatedHtml || typeof generatedHtml !== "string") {
          throw new Error("Failed to generate contract HTML");
        }

        // Ensure proper UTF-8 encoding and readable typography when embedding in iframe
        const hasHtmlTag = /<\s*html[\s\S]*>/i.test(generatedHtml);
        const wrappedHtml = hasHtmlTag
          ? generatedHtml
          : `<!doctype html><html lang="vi"><head><meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <style>
                html,body{margin:0;padding:24px;font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; line-height:1.6; color:#111827;}
                h1,h2,h3,h4,h5{margin:0 0 12px 0;}
                p{margin:0 0 10px 0;}
                .contract-root{white-space: pre-wrap; word-break: break-word;}
                table{border-collapse:collapse; width:100%;}
                th,td{border:1px solid #e5e7eb; padding:8px; vertical-align: top;}
                .signature-done{display:inline-block;padding:6px 10px;border-radius:6px;background:#e6f9ed;color:#067647;font-weight:600;border:1px solid #b7f0ce}
                .signature-placeholder{display:inline-block;padding:6px 10px;border-radius:6px;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0}
              </style></head><body><div class="contract-root">${generatedHtml}</div></body></html>`;
        setContractHtml(wrappedHtml);
        setRenderError(null);
      } catch (error) {
        console.error(
          "[ContractRenderer] Error loading contract template:",
          error
        );
        // Set error HTML instead of crashing
        const errorHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body{margin:0;padding:24px;font-family: system-ui; line-height:1.6; color:#111827;}
            .error{color:#dc2626;background:#fef2f2;padding:16px;border-radius:8px;border:1px solid #fecaca;}
          </style></head><body>
          <div class="error">
            <h2>Error loading contract</h2>
            <p>${error instanceof Error ? error.message : "Unknown error"}</p>
          </div>
          </body></html>`;
        setContractHtml(errorHtml);
        setRenderError(
          error instanceof Error ? error.message : "Unknown error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadContractTemplate();
  }, [contractData?.contractId]); // Only depend on contractId to avoid infinite loop

  // Signature interactions are intentionally disabled in this screen

  // Removed print/download/fullscreen

  if (renderError) {
    return (
      <div className="h-[600px] border rounded-lg flex items-center justify-center bg-red-50 border-red-200">
        <div className="text-center p-6">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Error rendering contract</p>
          <p className="text-sm text-red-500 mt-2">{renderError}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[600px] border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Generating contract...</p>
        </div>
      </div>
    );
  }

  if (!contractHtml) {
    return (
      <div className="h-[600px] border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">No contract content to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="bg-white/90 hover:bg-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Contract content */}
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <iframe
          srcDoc={contractHtml}
          className="w-full h-full border-0"
          title="Contract Preview"
          onError={(e) => {
            console.error("[ContractRenderer] iframe error:", e);
            setRenderError("Failed to load contract in iframe");
          }}
          onLoad={() => {
            /* no-op */
          }}
        />
      </div>
    </div>
  );
}
