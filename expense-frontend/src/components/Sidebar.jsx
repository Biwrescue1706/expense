import {
    FaChartPie,
    FaMoneyBillWave,
    FaList,
    FaTags
} from "react-icons/fa";

import {
    NavLink
} from "react-router-dom";

const menus = [

    {
        name: "Dashboard",
        icon: <FaChartPie />,
        path: "/dashboard"
    },

    {
        name: "รายรับ-รายจ่าย",
        icon: <FaMoneyBillWave />,
        path: "/transactions"
    },

    {
        name: "หมวดหมู่",
        icon: <FaList />,
        path: "/categories"
    },

    {
        name: "ประเภท",
        icon: <FaTags />,
        path: "/types"
    }

];

function Sidebar() {

    return (

        <aside className="w-64 bg-slate-900 text-white">

            <div className="text-center py-6 border-b border-slate-700">

                <h1 className="text-2xl font-bold">

                    Expense

                </h1>

            </div>

            <nav className="mt-5">

                {

                    menus.map(menu => (

                        <NavLink

                            key={menu.path}

                            to={menu.path}

                            className={({ isActive }) =>

                                `flex items-center gap-3 px-5 py-3 transition

                                ${isActive

                                    ? "bg-green-600"

                                    : "hover:bg-slate-800"

                                }`

                            }

                        >

                            {menu.icon}

                            {menu.name}

                        </NavLink>

                    ))

                }

            </nav>

        </aside>

    );

}

export default Sidebar;