// import Navbar from "../General/Navbar";
// import Sidebar from "../General/Sidebar";
// import ChatBar from "../General/ChatBar";
// import MobileNav from "../General/MobileNav";

// const AppLayout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="h-screen flex bg-black text-white overflow-hidden">
//       {/* Desktop Sidebar */}
//       <Sidebar />

//       {/* Main Area */}
//       <div className="flex flex-col flex-1 min-w-0">
//         <Navbar />

//         <main className="flex-1 overflow-y-auto">
//           <div className="w-full max-w-2xl mx-auto pb-24 lg:pb-6">
//             {children}
//           </div>
//         </main>
//       </div>

//       {/* Desktop Chat */}
//       <ChatBar />

//       {/* Mobile Bottom Navigation */}
//       <MobileNav />
//     </div>
//   );
// };

// export default AppLayout;

import Navbar from "../General/Navbar";
import Sidebar from "../General/Sidebar";
import ChatBar from "../General/ChatBar";
import MobileNav from "../General/MobileNav";

type LayoutVariant = "feed" | "full";

interface AppLayoutProps {
  children: React.ReactNode;
  variant?: LayoutVariant;
}

const AppLayout = ({ children, variant = "feed" }: AppLayoutProps) => {
  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />

        {/* Scroll Area */}
        <main className="flex-1 overflow-hidden">
          {variant === "feed" ? (
            /* CENTERED FEED (posts pages) */
            <div className="h-full overflow-y-auto">
              <div className="w-full max-w-2xl mx-auto pb-24 lg:pb-6">
                {children}
              </div>
            </div>
          ) : (
            /* FULL HEIGHT MODE (chat page) */
            <div className="h-full w-full flex flex-col">{children}</div>
          )}
        </main>
      </div>

      {/* Right Chat Sidebar (desktop) */}
      <ChatBar />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default AppLayout;
