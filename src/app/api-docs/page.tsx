'use client';

import { useEffect, useRef } from 'react';
import { APP_INFO } from '@/const/type';

/**
 * Swagger UI Page — renders OpenAPI documentation
 * 
 * Uses swagger-ui-dist CDN to avoid adding heavy npm dependencies.
 * Fetches the spec from /api/swagger endpoint.
 */
export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Load Swagger UI CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css';
    document.head.appendChild(link);

    // Load Swagger UI JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js';
    script.onload = () => {
      if (containerRef.current && (window as any).SwaggerUIBundle) {
        (window as any).SwaggerUIBundle({
          url: '/api/swagger',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            (window as any).SwaggerUIBundle.presets.apis,
            (window as any).SwaggerUIBundle.SwaggerUIStandalonePreset,
          ],
          layout: 'BaseLayout',
          defaultModelsExpandDepth: 2,
          defaultModelExpandDepth: 2,
          docExpansion: 'list',
          filter: true,
          tryItOutEnabled: true,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Custom header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">{APP_INFO.name} API Documentation</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            OpenAPI specification for the {APP_INFO.name} platform — Events sync, management, and more.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              v1.0.0
            </span>
            <span className="text-xs text-slate-400">
              Spec endpoint: <code className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">/api/swagger</code>
            </span>
          </div>
        </div>
      </div>

      {/* Swagger UI container */}
      <div id="swagger-ui" ref={containerRef} className="max-w-7xl mx-auto" />

      {/* Custom styles to match our design system */}
      <style jsx global>{`
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info { margin: 20px 0; }
        .swagger-ui .scheme-container { background: transparent; box-shadow: none; padding: 0; }
        .swagger-ui .opblock-tag { font-size: 1.1rem; border-bottom: 1px solid #e2e8f0; }
        .swagger-ui .btn.authorize { 
          border-color: #7c3aed; 
          color: #7c3aed; 
        }
        .swagger-ui .btn.authorize svg { fill: #7c3aed; }
        .swagger-ui .opblock.opblock-post { border-color: #7c3aed; background: rgba(124, 58, 237, 0.03); }
        .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #7c3aed; }
        .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #2563eb; }
        .swagger-ui .btn.execute { background: #7c3aed; border-color: #7c3aed; }
        .swagger-ui .btn.execute:hover { background: #6d28d9; }
        .swagger-ui .response-col_status { font-weight: 600; }
      `}</style>
    </div>
  );
}
