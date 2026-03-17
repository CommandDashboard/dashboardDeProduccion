'use client';

import Link from 'next/link';

interface Defect {
  id: number;
  documentId: string;
  defect_type: string;
  severity: string;
  location_x: number;
  location_y: number;
  image?: {
    url: string;
  } | {
    url: string;
  }[] | null;
}

interface Piece {
  id: number;
  documentId: string;
  idPiece: string;
  sku: string | null;
  quality_status: string | null;
  defects?: Defect[];
  photo?: {
    url: string;
    formats?: any;
  } | null;
}

export default function VisualBatchMap({ pieces }: { pieces: Piece[] }) {
  if (!pieces || pieces.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center gap-3 text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
        <span className="material-symbols-outlined text-5xl opacity-20">view_quilt</span>
        <p className="text-sm font-bold uppercase tracking-widest">No hay piezas para mapear</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {pieces.map((piece) => (
        <div 
          key={piece.id} 
          className="bg-[#0f172a] rounded-3xl border border-slate-800 p-5 shadow-2xl hover:border-[--color-primary]/50 transition-all group overflow-hidden relative"
        >
          {/* Piece Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">Nº DE SERIE</p>
              <h4 className="font-black text-white text-base tracking-tight">{piece.sku || `#${piece.idPiece || piece.id}`}</h4>
            </div>
            <div className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border ${
              piece.quality_status === 'Homogéneo' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {piece.quality_status || 'Pendiente'}
            </div>
          </div>

          {/* Visual Piece Canvas / Simulation */}
          <div className="aspect-[4/3] bg-slate-950 rounded-2xl relative border border-slate-800 overflow-hidden group-hover:border-[--color-primary]/30 transition-all shadow-inner">
            {/* Real photo if available (from piece.photo or first defect.image), otherwise texture */}
            {(() => {
              const piecePhoto = piece.photo?.url;
              const firstDefectImage = piece.defects?.[0]?.image;
              const defectPhoto = Array.isArray(firstDefectImage) ? firstDefectImage[0]?.url : (firstDefectImage as any)?.url;
              
              const finalPhoto = piecePhoto || defectPhoto;
              
              if (finalPhoto) {
                return (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${finalPhoto}`}
                    alt={piece.sku || ''}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                );
              }
              
              return (
                <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" 
                     style={{ 
                       background: `
                         radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),
                         linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%),
                         repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(255,255,255,0.01) 101px, rgba(255,255,255,0.01) 102px)
                       `
                     }} 
                />
              );
            })()}
            
            {/* Dark overlay for better marker contrast */}
            {(piece.photo?.url || piece.defects?.[0]?.image) && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}
            
            {/* Technical Grid overlay (always visible but subtle) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ background: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '10% 10%' }} 
            />

            {/* Viewport Labels (Technical Look) */}
            <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-600 uppercase tracking-tighter">X: 0.00 — 100.00</div>
            <div className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-600 uppercase tracking-tighter">Y: 0.00 — 100.00</div>
            
            {/* Defect Markers */}
            {piece.defects?.map((defect) => (
              <div
                key={defect.id}
                className="absolute size-4 -translate-x-1/2 -translate-y-1/2 cursor-help group/defect"
                style={{ left: `${defect.location_x}%`, top: `${defect.location_y}%` }}
              >
                <div className={`size-full rounded-full animate-ping absolute opacity-60 ${
                  defect.severity === 'High' ? 'bg-red-500' : defect.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className={`size-full rounded-full relative z-10 border-2 border-slate-950 shadow-lg ${
                  defect.severity === 'High' ? 'bg-red-500' : defect.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                
                {/* Defect Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 invisible group-hover/defect:opacity-100 group-hover/defect:visible transition-all whitespace-nowrap z-20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`size-2 rounded-full ${defect.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <p className="font-black uppercase tracking-wider">{defect.defect_type}</p>
                  </div>
                  <p className="opacity-60 font-mono">COORD: {defect.location_x}%, {defect.location_y}%</p>
                </div>
              </div>
            ))}

            {(!piece.defects || piece.defects.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                <div className="size-10 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
                  <span className="material-symbols-outlined text-emerald-500 text-xl">verified</span>
                </div>
                <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">LIBRE DE DEFECTOS</span>
              </div>
            )}
          </div>

          {/* Piece Footer */}
          <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-500">barcode_scanner</span>
              <span className="text-[10px] font-bold text-slate-400">DEFECTOS: {piece.defects?.length || 0}</span>
            </div>
            <Link 
              href={`/history/${piece.id}`}
              className="text-[--color-primary] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:brightness-125 transition-all"
            >
              DETALLE <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
