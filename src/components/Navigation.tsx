import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import { useState, useEffect } from "react";



import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

import { ModeToggle } from "@/components/ModeToggle";
import { SwitchToggle } from "@/components/SwitchToggle";

function ResponsiveToggle() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)"); // Adjust breakpoint as needed
    setIsSmallScreen(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className="flex ml-4">
      {isSmallScreen ? <ModeToggle /> : <SwitchToggle />}
    </div>
  );
}

export default function NavigationMain() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)"); // Adjust breakpoint as needed
    setIsSmallScreen(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div
      className={`${
        isSmallScreen ? "" : "fixed"
      } top-0 left-0 sm:bg-white dark:sm:bg-black  lg:bg-transparent lg:backdrop-blur-sm md:bg-transparent md:backdrop-blur-sm w-full z-50 h-16 flex items-center px-4 sm:px-6 lg:px-8 flex-col sm:flex-row`}
    >
      <div className="text">
        <a href="/">
          <img
            src="/images/logo.png"
            className="hover:filter hover:hue-rotate-[-80deg] hover:brightness-150"
            width="70px"
            height="15px"
            alt="Logo"
          />
        </a>
      </div>
      <div className="flex-1"></div>
      <div className="flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} lg:bg-transparent lg:backdrop-blur-sm md:bg-transparent md:backdrop-blur-sm`}
                asChild
              >
                <a href="/">Home</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="md:bg-transparent md:backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-sm">
                Research
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="min-w-[200px] p-3">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                          asChild
                        >
                          <a href="/publications/">Publications</a>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                          asChild
                        >
                          <a href="/students/">Students</a>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                          asChild
                        >
                          <a href="/projects/">Projects</a>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="md:bg-transparent md:backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-sm">
                Teaching
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="min-w-[200px] p-3">
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                          asChild
                        >
                          <a href="/teaching/programming/">Computer Science</a>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                          asChild
                        >
                          <a href="/teaching/machinelearning/">Machine Learning</a>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} md:bg-transparent md:backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-sm`}
                asChild
              >
                <a href="/contact">Contact</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

    <div className="flex ml-4">
            <SwitchToggle  />
    </div>
    </div>
  );
}

