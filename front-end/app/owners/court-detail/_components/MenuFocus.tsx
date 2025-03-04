import React from "react";

interface MenuItem {
    label: string;
    link?: string;
}

interface MenuFocusProps {
    items: MenuItem[];
}

function MenuFocus({ items }: MenuFocusProps) {
    return (
        <nav className="text-md font-sans w-full bg-slate-100 flex items-center h-14 rounded-md">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index < items.length - 1 ? (
                        <>
                            <a
                                href={item.link || '#'}
                                className="text-blue-600 hover:underline mx-1.5"
                            >
                                {item.label}
                            </a>
                            <span className="text-black mx-1.5">&gt;</span>
                        </>
                    ) : (
                        <span className="text-black mx-1.5">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

export default MenuFocus;
