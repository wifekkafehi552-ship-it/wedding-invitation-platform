export default function WeddingNotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "#1E1A16", color: "#F6F1E7", fontFamily: "'Cairo', sans-serif" }}
    >
      <p style={{ fontFamily: "'Aref Ruqaa', serif" }} className="text-3xl mb-3">
        لم يتم العثور على هذه الدعوة
      </p>
      <p className="opacity-60 text-sm max-w-xs">
        قد يكون الرابط غير صحيح، أو أن الدعوة لم تُنشر بعد من صاحبها.
      </p>
    </div>
  );
}
