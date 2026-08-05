import { useEffect, useState } from "react";

import {
    getCategories
} from "../services/category.service";

import {
    getTypes
} from "../services/type.service";

function Categories() {

    const [types, setTypes] = useState([]);

    const [typeId, setTypeId] = useState("");

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        loadTypes();

    }, []);

    const loadTypes = async () => {

        const data = await getTypes();

        setTypes(data);

    };

    const loadCategory = async (id) => {

        const data = await getCategories(id);

        setCategories(data);

    };

    return (

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">

                หมวดหมู่

            </h1>

            <select

                className="border rounded p-2 mb-5"

                value={typeId}

                onChange={(e) => {

                    setTypeId(e.target.value);

                    loadCategory(e.target.value);

                }}

            >

                <option value="">

                    เลือกประเภท

                </option>

                {

                    types.map(type => (

                        <option

                            key={type.id}

                            value={type.id}

                        >

                            {type.typeName}

                        </option>

                    ))

                }

            </select>

            <table className="w-full border">

                <thead>

                    <tr>

                        <th className="border p-3">

                            ID

                        </th>

                        <th className="border p-3">

                            หมวดหมู่

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        categories.map(category => (

                            <tr key={category.id}>

                                <td className="border p-3">

                                    {category.id}

                                </td>

                                <td className="border p-3">

                                    {category.name}

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default Categories;