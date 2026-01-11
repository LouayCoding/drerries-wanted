'use client';

interface DiffViewerProps {
  oldText: string;
  newText: string;
}

export default function DiffViewer({ oldText, newText }: DiffViewerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Old Content */}
      <div className="bg-[#2f3136] border border-[#202225] rounded-lg p-4">
        <div className="text-xs font-bold text-[#f04747] mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#f04747] rounded-full"></span>
          ORIGINEEL
        </div>
        <div className="text-sm text-[#b9bbbe] whitespace-pre-wrap break-words">
          {oldText || <span className="text-[#72767d] italic">Leeg bericht</span>}
        </div>
      </div>

      {/* New Content */}
      <div className="bg-[#2f3136] border border-[#202225] rounded-lg p-4">
        <div className="text-xs font-bold text-[#43b581] mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#43b581] rounded-full"></span>
          AANGEPAST
        </div>
        <div className="text-sm text-[#b9bbbe] whitespace-pre-wrap break-words">
          {newText || <span className="text-[#72767d] italic">Leeg bericht</span>}
        </div>
      </div>
    </div>
  );
}



