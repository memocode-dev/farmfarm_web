'use client'

import {useParams} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {useFindHouse} from "@/openapi/api/houses/houses";
import HouseUpdate from "@/components/admin/house/HouseUpdate";
import HouseSections from "@/components/admin/house/section/HouseSections";

const House = () => {

    const params = useParams();
    const houseId = params.id as string;

    const {isError, isLoading, data: house, refetch: findHouseRefetch} =
        useFindHouse(houseId, {
            query: {
                queryKey: ['House', houseId],
            },
        });

    if (isError) {
        return (
            <div className="flex space-x-4">
                <div>잠시후에 다시 시도해주세요</div>
                <Button onClick={() => findHouseRefetch()}>재시도</Button>
            </div>
        )
    }

    return (
        <div className="flex-1 p-5 space-y-5">
            <div className="flex justify-center">
                <HouseUpdate houseId={houseId} house={house!} isLoading={isLoading}
                             findHouseRefetch={findHouseRefetch}/>
            </div>

            <HouseSections houseId={houseId}/>
        </div>
    )
}

export default House;