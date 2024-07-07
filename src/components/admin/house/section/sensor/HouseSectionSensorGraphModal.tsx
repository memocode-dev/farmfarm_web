import {useContext, useEffect, useRef, useState} from "react";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {useFindAllHouseSectionSensorMeasurements} from "@/openapi/api/houses/houses";
import DatePicker from "@/components/common/DatePicker";
import {Button} from "@/components/ui/button";
import {ModalContext, ModalTypes} from "@/context/ModalConext";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

interface IFieldStats {
    TEMPERATURE: {
        min: number;
        max: number;
        name: string;
        symbol: string;
        color: string;
    };
    HUMIDITY: {
        min: number;
        max: number;
        name: string;
        symbol: string;
        color: string;
    };
}

type FieldStatsKeys = keyof IFieldStats;

const fieldStats: IFieldStats = {
    TEMPERATURE: {
        min: -20,
        max: 50,
        name: "온도",
        symbol: "°C",
        color: "#ff7300",
    },
    HUMIDITY: {
        min: 0,
        max: 100,
        name: "습도",
        symbol: "%",
        color: "#387908",
    }
};

const HouseSectionSensorGraphModal = () => {
    1
    const {modalState, closeModal} = useContext(ModalContext);
    const [houseId, setHouseId] = useState<string>()
    const [houseSectionId, setHouseSectionId] = useState<string>()
    const [houseSectionSensorId, setHouseSectionSensorId] = useState<string>()
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [date, setDate] =
        useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)))
    const [chartData, setChartData] = useState<string[]>()

    const {data: houseSectionSensorData} =
        useFindAllHouseSectionSensorMeasurements(houseId!, houseSectionId!, houseSectionSensorId!, {
            startMeasuredAt: date.toISOString(),
            endMeasuredAt: new Date(new Date(date).setDate(date.getDate() + 1)).toISOString(),
        }, {
            query: {
                queryKey: ['HouseSectionSensorGraphModal', date, houseSectionSensorId],
                refetchInterval: 60000,
                enabled: !!modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.isVisible,
            }
        });

    const groupByTime = (data: any) => {
        if (!data) {
            return [];
        }
        const result: any = {};

        data.forEach((item: any) => {
            // HH:mm 형식으로 시간 변환
            const date = new Date(item.measuredAt);
            const time = date.toTimeString().slice(0, 5);

            if (!result[time]) {
                result[time] = {"TEMPERATURE": null, "HUMIDITY": null};
            }

            result[time][item.measurementType] = item.value;
        });

        return result;
    };

    const getYDomain = (data: any) => {
        if (!data) return {min: 0, max: 0};

        const hasTemperature = data.some((item: any) => item.measurementType === 'TEMPERATURE');
        const hasHumidity = data.some((item: any) => item.measurementType === 'HUMIDITY');

        if (hasTemperature && hasHumidity) {
            return {
                min: Math.min(fieldStats.TEMPERATURE.min, fieldStats.HUMIDITY.min),
                max: Math.max(fieldStats.TEMPERATURE.max, fieldStats.HUMIDITY.max),
            };
        } else if (hasTemperature) {
            return {
                min: fieldStats.TEMPERATURE.min,
                max: fieldStats.TEMPERATURE.max,
            };
        } else if (hasHumidity) {
            return {
                min: fieldStats.HUMIDITY.min,
                max: fieldStats.HUMIDITY.max,
            };
        }
    };

    const yDomain = getYDomain(houseSectionSensorData?.measurements);

    useEffect(() => {
        if (!divRef.current) return;

        if (modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.isVisible === true) {
            // ResizeObserver 인스턴스 생성
            const resizeObserver = new ResizeObserver(entries => {
                const {width} = entries[0].contentRect;
                setWidth(width);
            });

            // 관찰 시작
            resizeObserver.observe(divRef.current);

            // 컴포넌트가 언마운트 될 때 관찰 중단
            return () => {
                if (divRef.current) {
                    resizeObserver.unobserve(divRef.current);
                }
            };
        }
    }, [divRef.current, modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]]);

    useEffect(() => {
        if (modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.isVisible === true) {
            setHouseId(modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.data.houseId)
            setHouseSectionId(modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.data.houseSectionId)
            setHouseSectionSensorId(modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]?.data.houseSectionSensorId)

            const groupedData = groupByTime(houseSectionSensorData?.measurements);

            const xTicks = Array.from({length: 144}, (_, index) => {
                const hour = Math.floor(index / 6);
                const minute = (index % 6) * 10;
                return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            });

            const filledData = xTicks.map((tick) => {
                return groupedData[tick]
                    ? {
                        ...groupedData[tick],
                        timestamp: tick,
                    }
                    : {timestamp: tick};
            });
            setChartData(filledData);
        }
    }, [modalState[ModalTypes.HOUSE_SECTION_SENSOR_GRAPH], houseSectionSensorData]);

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
                className="rounded-lg max-w-[90%] sensorGraphModal w-full overflow-y-auto px-3 sm:px-6"
            >
                <DialogHeader>
                    <DialogTitle>하우스 동 센서 그래프</DialogTitle>
                    <DialogDescription>
                        하우스 동 센서의 변화를 그래프로 확인할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <div className="flex items-center space-x-2">
                        <DatePicker date={date} setDate={(day, selectedDay, activeModifiers, e) => {
                            setDate(selectedDay);
                        }}/>
                        <Button className="w-fit h-fit px-3"
                                onClick={() => setDate(new Date(new Date().setHours(0, 0, 0, 0)))}>오늘</Button>
                    </div>

                    <div className="!p-0" style={{width: `${width}px`}}>
                        <div className="flex flex-col items-center">
                            <div className="relative flex w-full gap-4">
                                <div className="overflow-x-auto hover:graph_scroll_custom">
                                    <LineChart
                                        width={4000}
                                        height={300}
                                        data={chartData}
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
                                            domain={[yDomain!.min, yDomain!.max]}
                                            ticks={Array.from({length: (yDomain!.max - yDomain!.min) / 10 + 1}, (_, index) => yDomain!.min + index * 10)}
                                        />
                                        <Line type="monotone" dataKey="TEMPERATURE" stroke="#ff7300"
                                              activeDot={{r: 8}}/>
                                        <Line type="monotone" dataKey="HUMIDITY" stroke="#387908"/>
                                    </LineChart>
                                </div>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                {Object.keys(fieldStats).map((key) => {
                                    const field = fieldStats[key as FieldStatsKeys];
                                    return (
                                        <div key={key} style={{color: field.color}}>
                                            {field.name}({field.symbol})
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default HouseSectionSensorGraphModal;