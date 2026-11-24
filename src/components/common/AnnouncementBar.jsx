
const messages = [
  "NEW COLLECTION AVAILABLE",
  "BAHAWALPUR",
  "CASH ON DELIVERY ACROSS PAKISTAN",
  "DELIVERY RS. 250",
  "0312 1825417",
  "BAHAWALPUR",
];

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-[#21130B] text-[#C9A66B]">
      <div className="flex w-max animate-marquee items-center whitespace-nowrap py-2.5">

        {[...messages, ...messages].map((message, index) => (
          <div key={index} className="flex items-center">
            <span className="px-6 text-[10px] font-semibold tracking-[2px] sm:px-8 sm:text-[11px]">
              {message}
            </span>

            <span className="text-[8px] text-[#A9844D]">
              ◆
            </span>
          </div>
        ))}

      </div>

      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 32s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
