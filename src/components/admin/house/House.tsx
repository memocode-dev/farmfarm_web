'use client'

import {useParams} from 'next/navigation';
import HouseUpdate from "@/components/admin/house/HouseUpdate";
import HouseSections from "@/components/admin/house/section/HouseSections";

const House = () => {

    const params = useParams();
    const houseId = params.id as string;

    return (
        <div className="flex-1 p-5 space-y-5">
            <div className="flex justify-start">
                <HouseUpdate houseId={houseId}/>
            </div>

            <HouseSections houseId={houseId}/>
        </div>
    )
}

export default House;