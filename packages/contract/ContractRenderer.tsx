"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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

  const loadContractTemplate = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use the template from TypeScript file
      const generator = new ContractGenerator(CONTRACT_TEMPLATE);
      const generatedHtml = generator.generateContract(contractData);
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
    } catch (error) {
      console.error("Error loading contract template:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contractData]);

  // Load contract template
  useEffect(() => {
    loadContractTemplate();
  }, [loadContractTemplate]);

  // Signature interactions are intentionally disabled in this screen

  // Removed print/download/fullscreen

  if (isLoading) {
    return (
      <div className="h-[600px] border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Đang tạo hợp đồng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="bg-white/90 hover:bg-white"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Contract content */}
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <iframe
          srcDoc={contractHtml}
          className="w-full h-full border-0"
          title="Contract Preview"
          onLoad={() => {
            /* no-op */
          }}
        />
      </div>
    </div>
  );
}
