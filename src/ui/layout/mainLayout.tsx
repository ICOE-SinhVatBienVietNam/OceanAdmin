import React, { ReactNode, useRef, useState } from "react"
import { Link, Route, Routes, useLocation } from "react-router-dom"

// Config
import { routeConfig } from "../../config/routeConfig"

// Images
import Logo from '../../assets/SinhVatBienVN.png'

// Page
import Overview from "../page/Overview"
import Collaborator from "../page/Collaborator"
import Database from "../page/Database"
import { Auth } from "../component/Auth"
import UserPage from "../page/User"
import QuestionPage from "../page/Question"
import ContributionPage from "../page/Contribution"

const MainLayout: React.FC = () => {
    // Location
    const pathLocation = useLocation()

    // Menu
    const menu = useRef<{ content: string, icon: ReactNode, path: string }[]>([
        {
            content: "Tổng quan",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
            </svg>),
            path: routeConfig.layout.main + routeConfig.overview.root
        },
        {
            content: "Cộng tác",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>),
            path: routeConfig.layout.main + routeConfig.collaborator.root

        },
        {
            content: "Người dùng",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>),
            path: routeConfig.layout.main + routeConfig.user.root
        },
        {
            content: "Dữ liệu",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
            </svg>),
            path: routeConfig.layout.main + routeConfig.database.root
        },
        {
            content: "Câu hỏi",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
            </svg>),
            path: routeConfig.layout.main + routeConfig.question.root
        },
        {
            content: "Đóng góp",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z" />
            </svg>),
            path: routeConfig.layout.main + routeConfig.contribution.root
        }
    ])

    return (
        <>
            <Auth />
            <div className="h-full w-full flex flex-col">
                <div className="h-[60px] flex justify-between items-center px-2.5 border-b-[0.5px] border-lightGray">
                    <span className="h-full flex gap-5 items-center-safe">
                        <img src={Logo} className="h-[60%]" />

                        <span className="flex gap-1.5 items-center-safe">
                            {menu.current.find(f => f.path === pathLocation.pathname)?.icon}
                            <h1 className="text-csLarge font-medium">{menu.current.find(f => f.path === pathLocation.pathname)?.content}</h1>
                        </span>
                    </span>

                    <span className="h-full flex items-center-safe">
                        <p className="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                            </svg>

                            duytran.290804@gmail.com
                        </p>
                    </span>
                </div>

                <div className="relative flex-1 w-full flex items-center">
                    {/* Menu */}
                    <div className="sticky top-0 left-0 w-[60px] h-full flex flex-col gap-5 border-r-[0.5px] border-lightGray p-2.5">
                        {menu.current.map((page, i) => {
                            return (
                                <Link
                                    to={page.path}
                                    key={i}
                                    className={`group hover:cursor-grab relative w-full aspect-square flex justify-center items-center ${pathLocation.pathname === page.path && "bg-lighterGray"} rounded-small`}
                                >
                                    {page.icon}

                                    <p className="group-hover:block hidden absolute z-5000 left-[calc(100%+10px)] before:content-[''] before:absolute before:top-1/2 before:-left-2 before:-translate-y-1/2 before:border-y-6 before:border-y-transparent before:border-r-8 before:border-r-mainDark text-nowrap bg-mainDark text-white font-medium text-csNormal px-3.5 py-1 rounded-small">
                                        {page.content}
                                    </p>
                                </Link>
                            )
                        })}

                    </div>

                    {/* Routing */}
                    <div className="flex-1 h-full overflow-hidden">
                        <Routes>
                            <Route index Component={Overview} />
                            <Route path={routeConfig.collaborator.root} Component={Collaborator} />
                            <Route path={routeConfig.database.root} Component={Database} />
                            <Route path={routeConfig.user.root} Component={UserPage} />
                            <Route path={routeConfig.question.root} Component={QuestionPage} />
                            <Route path={routeConfig.contribution.root} Component={ContributionPage} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainLayout