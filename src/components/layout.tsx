import React from "react";
import { useRouter } from "next/router";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./ui/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  if (router.pathname === "/") {
    return children;
  }

  if (router.pathname === "/orgs") {
    return (
      <div className="container mx-auto max-w-screen-lg py-20">{children}</div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <div className="container mx-auto max-w-screen-lg py-20">
          <SidebarTrigger className="absolute top-0 left-0 cursor-pointer" />
          {children}
        </div>
      </main>
    </SidebarProvider>
    // <div className="container mx-auto max-w-screen-lg py-20">
    //   <div className="fixed top-4 right-4 flex items-center space-x-4">
    //     <div className="flex h-5 items-center space-x-4 text-sm">
    //       <Link href="/org">
    //         <Button variant="link" className="text-white cursor-pointer">
    //           Organizations
    //         </Button>
    //       </Link>
    //       <Separator orientation="vertical" />
    //       <Button variant="link" className="text-white cursor-pointer">
    //         Docs
    //       </Button>
    //       <Separator orientation="vertical" />
    //       <Button variant="link" className="text-white cursor-pointer">
    //         Source
    //       </Button>
    //       <Separator orientation="vertical" />
    //       {user ? (
    //         <>
    //           <Button
    //             variant="link"
    //             className="text-white cursor-pointer"
    //             onClick={handleLogout}
    //           >
    //             Logout
    //           </Button>
    //           <Separator orientation="vertical" />
    //           <Avatar>
    //             <AvatarImage
    //               src={user.photoURL || ""}
    //               alt={user.displayName || ""}
    //             />
    //             <AvatarFallback className="text-gray-700 text-2xl">
    //               {user.displayName?.charAt(0)}
    //             </AvatarFallback>
    //           </Avatar>
    //         </>
    //       ) : (
    //         <Button
    //           variant="link"
    //           className="text-white cursor-pointer"
    //           onClick={handleLogin}
    //         >
    //           Login
    //         </Button>
    //       )}
    //     </div>
    //   </div>
    //   {children}
    // </div>
    // </>
  );
}
