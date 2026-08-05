import { useEffect, useState } from "react";
import {
    getTypes
} from "../services/type.service";

function Types() {

    const [types, setTypes] = useState([]);

    useEffect(() => {
        loadTypes();
    }, []);

    const loadTypes = async () => {
        const data = await getTypes();
        setTypes(data);
    };

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                ประเภท
            </h1>

            <table className="w-full border">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="border p-3">ID</th>

                        <th className="border p-3">ประเภท</th>

                    </tr>

                </thead>

                <tbody>

                    {types.map(type => (

                        <tr key={type.id}>

                            <td className="border p-3">
                                {type.id}
                            </td>

                            <td className="border p-3">
                                {type.typeName}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );

}

export default Types;