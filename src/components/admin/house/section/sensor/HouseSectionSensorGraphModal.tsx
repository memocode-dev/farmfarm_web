import {useContext, useEffect, useRef, useState} from "react";
import {format, parseISO} from "date-fns";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {FindAllHouseSectionsResponseHouseSectionSensor} from "@/openapi/model";
import {useFindAllHouseSectionSensorMeasurements} from "@/openapi/api/houses/houses";
import DatePicker from "@/components/common/DatePicker";
import {Button} from "@/components/ui/button";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

const HouseSectionSensorGraphModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const [houseId, setHouseId] = useState<string>()
    const [houseSectionId, setHouseSectionId] = useState<string>()
    const [sensor, setSensor] = useState<FindAllHouseSectionsResponseHouseSectionSensor>()
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [date, setDate] =
        useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)))

    const {data: houseSectionSensorData} =
        useFindAllHouseSectionSensorMeasurements(houseId!, houseSectionId!, sensor?.id!, {
            startMeasuredAt: date.toISOString(),
            endMeasuredAt: new Date(new Date(date).setDate(date.getDate() + 1)).toISOString(),
        }, {
            query: {
                queryKey: ['HouseSectionSensorGraphModal', date, sensor?.id!],
                refetchInterval: 60000,
            }
        });
    console.log("houseSectionSensorData",houseSectionSensorData)

    const xTicks = Array.from({length: 288}, (_, index) => {
        const hour = Math.floor(index / 12);
        const minute = (index % 12) * 5;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    });

    const filledData = xTicks.map(tick => {
        const dataPoint = houseSectionSensorData?.measurements?.find(d => {
            return format(parseISO(d.measuredAt as never), 'HH:mm') === tick
        });
        return dataPoint ? {...dataPoint, timestamp: tick} : {timestamp: tick};
    });

    // const yDomain = houseSectionSensorData?.measurements!
    //     .reduce((acc, type) => {
    //         acc.min = Math.min(acc.min, fieldStats[type.name as FieldStatsKeys].min);
    //         acc.max = Math.max(acc.max, fieldStats[type.name as FieldStatsKeys].max);
    //         return acc;
    //     }, {min: Infinity, max: -Infinity});

    useEffect(() => {
        const div = divRef.current;
        if (div) {
            // ResizeObserver 인스턴스 생성
            const resizeObserver = new ResizeObserver(entries => {
                const {width, height} = entries[0].contentRect;
                setWidth(width);
            });

            // 관찰 시작
            resizeObserver.observe(div);

            // 컴포넌트가 언마운트 될 때 관찰 중단
            return () => resizeObserver.unobserve(div);
        }
    }, []);

    useEffect(() => {
        if (modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.isVisible === true) {
            setHouseId(modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.data.houseId)
            setHouseSectionId(modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.data.houseSectionId)

            const sensor = modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.data.sensor
            setSensor(sensor)
        }
    }, [modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]]);

    return (
        <Dialog
            modal={true}
            open={modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.isVisible}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal({
                        name: ModalTypes.HOUSE_SECTION_SENSOR_GRAPH
                    });
                }
            }}
        >
            <DialogContent
                ref={divRef}
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="rounded-lg max-w-[90%] h-[90%] w-[600px] p-0 sm:p-6">
                <DialogHeader className="px-6 pt-6 sm:p-0">
                    <DialogTitle>하우스 동 센서 그래프</DialogTitle>
                    <DialogDescription>
                        하우스 동 센서의 변화를 그래프로 확인할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full px-3 sm:px-0"
                     style={{width: `${width}px`}}>
                    <div className="space-y-4">
                        <div>
                            {/*{sensor.sensor?.sensorTypes*/}
                            {/*    ?.filter((type) => type.name !== "timestamp")*/}
                            {/*    ?.map(type => fieldStats[type.name as FieldStatsKeys].name).join(" / ")}*/}
                        </div>
                        <div className="flex items-center space-x-2">
                            <DatePicker date={date} setDate={(day, selectedDay, activeModifiers, e) => {
                                console.log(day);
                                console.log(activeModifiers);
                                console.log(e);
                                setDate(selectedDay);
                            }}/>
                            <Button className="w-fit h-fit px-3"
                                    onClick={() => setDate(new Date(new Date().setHours(0, 0, 0, 0)))}>오늘</Button>
                        </div>
                        {/*{current_house_sensor_data && <div className="border rounded p-4">*/}
                        {/*    <div>*/}
                        {/*        {houseSensor?.sensor?.sensorTypes*/}
                        {/*            ?.filter((type) => type.name !== "timestamp")*/}
                        {/*            ?.map(type => {*/}
                        {/*                return (*/}
                        {/*                    <div key={type.id} className="flex space-x-2 items-center my-1">*/}
                        {/*                        <Badge*/}
                        {/*                            className="text-[20px]">현재 {fieldStats[type.name as FieldStatsKeys].name}</Badge>*/}
                        {/*                        <Badge*/}
                        {/*                            className="text-[20px]">{current_house_sensor_data[type.name as FieldStatsKeys] as never} {fieldStats[type.name as FieldStatsKeys].symbol}</Badge>*/}
                        {/*                        <Badge variant="secondary">*/}
                        {/*                            {differenceInMinutes(new Date(), new Date(current_house_sensor_data.timestamp as never))}분전*/}
                        {/*                        </Badge>*/}
                        {/*                    </div>*/}
                        {/*                )*/}
                        {/*            })}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*}*/}
                    </div>

                    <div className="!p-0">
                        <div className="flex flex-col items-center">
                            <div className="relative flex w-full gap-4">
                                <div className="overflow-x-auto hover:graph_scroll_custom">
                                    <LineChart
                                        width={5000}
                                        height={350}
                                        data={filledData}
                                        margin={{top: 20, right: 20, left: -20, bottom: 0}}
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <Tooltip labelClassName="text-[20px]" wrapperClassName="text-[20px]"/>
                                        <XAxis
                                            dataKey="timestamp"
                                            tick={true}
                                            ticks={Array.from({length: 48}, (_, index) =>
                                                `${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`)}
                                        />
                                        <YAxis
                                            tick={true}
                                            axisLine={true}
                                            domain={[0, 100]}
                                            // domain={[yDomain.min, yDomain.max]}
                                            // ticks={Array.from({length: (yDomain.max - yDomain.min) / 10 + 1}, (_, index) => yDomain.min + index * 10)}
                                        />
                                        {houseSectionSensorData?.measurements?.map((measurement, index) => {
                                            return (
                                                <Line key={index} type="monotone"
                                                      dataKey={measurement.measurementType} stroke="#ff7300"
                                                      name={`${measurement.measurementType}(${measurement.measurementType})`}/>
                                            )
                                        })}
                                    </LineChart>
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                {/*{houseSensor?.sensor?.sensorTypes*/}
                                {/*    ?.filter((type) => type.name !== "timestamp")*/}
                                {/*    ?.map(type => {*/}
                                {/*        return (*/}
                                {/*            <div key={type.id} style={{*/}
                                {/*                color: fieldStats[type.name as FieldStatsKeys].color,*/}
                                {/*            }}>{fieldStats[type.name as FieldStatsKeys].name}({fieldStats[type.name as FieldStatsKeys].symbol})</div>*/}
                                {/*        )*/}
                                {/*    })}*/}
                            </div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default HouseSectionSensorGraphModal;