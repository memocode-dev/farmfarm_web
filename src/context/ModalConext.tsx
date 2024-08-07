'use client'

import React, {ReactNode, useState} from "react";
import {FindAllHouseSectionsResponseHouseSectionSensor} from "@/openapi/model";

interface IModalContext {
    modalState: IModal;
    openModal: (modalOptions: IOpenModal<ModalTypes>) => void;
    closeModal: (closeOptions: ICloseModal) => void;
}

export enum ModalTypes {
    // dashboard
    DASHBOARD_CREATE = "DASHBOARD_CREATE",

    // house
    HOUSE_CREATE = "HOUSE_CREATE",

    // houseSection
    HOUSE_SECTION_CREATE = "HOUSE_SECTION_CREATE",
    HOUSE_SECTION_UPDATE = "HOUSE_SECTION_UPDATE",

    // houseSectionSensor
    HOUSE_SECTION_SENSOR_CREATE = "HOUSE_SECTION_SENSOR_CREATE",
    HOUSE_SECTION_SENSOR_UPDATE = "HOUSE_SECTION_SENSOR_UPDATE",
    HOUSE_SECTION_SENSOR_GRAPH = "HOUSE_SECTION_SENSOR_GRAPH",

    // organization
    ORGANIZATION_CREATE = "ORGANIZATION_CREATE",
}

type IModal = {
    // dashboard
    [ModalTypes.DASHBOARD_CREATE]: {
        isVisible: boolean,
        data: {},
    },

    // house
    [ModalTypes.HOUSE_CREATE]: {
        isVisible: boolean,
        data: {},
    },

    // houseSection
    [ModalTypes.HOUSE_SECTION_CREATE]: {
        isVisible: boolean,
        data: {
            houseId: string,
            setCreatedHouseSectionId: () => void
        },
    },
    [ModalTypes.HOUSE_SECTION_UPDATE]: {
        isVisible: boolean,
        data: {
            houseId: string,
            houseSectionId: string,
            sectionNumber: number
        },
    },

    // houseSectionSensor
    [ModalTypes.HOUSE_SECTION_SENSOR_CREATE]: {
        isVisible: boolean,
        data: string
    },
    [ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]: {
        isVisible: boolean,
        data: {
            houseId: string,
            houseSectionId: string,
            sensor: FindAllHouseSectionsResponseHouseSectionSensor
        }
    },
    [ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]: {
        isVisible: boolean,
        data: {
            houseId: string,
            houseSectionId: string,
            houseSectionSensorId: string
        }
    },

    // organization
    [ModalTypes.ORGANIZATION_CREATE]: {
        isVisible: boolean,
        data: {}
    },
}

const initialModalState: IModal = {
    // dashboard
    [ModalTypes.DASHBOARD_CREATE]: {
        isVisible: false,
        data: {},
    },

    // house
    [ModalTypes.HOUSE_CREATE]: {
        isVisible: false,
        data: {},
    },

    // houseSection
    [ModalTypes.HOUSE_SECTION_CREATE]: {
        isVisible: false,
        data: {
            houseId: "",
            setCreatedHouseSectionId: () => {
            }
        },
    },
    [ModalTypes.HOUSE_SECTION_UPDATE]: {
        isVisible: false,
        data: {
            houseId: "",
            houseSectionId: "",
            sectionNumber: 0
        },
    },

    // houseSectionSensor
    [ModalTypes.HOUSE_SECTION_SENSOR_CREATE]: {
        isVisible: false,
        data: "",
    },
    [ModalTypes.HOUSE_SECTION_SENSOR_UPDATE]: {
        isVisible: false,
        data: {
            houseId: "",
            houseSectionId: "",
            sensor: {
                createdAt: "",
                id: "",
                nameForAdmin: "",
                nameForUser: "",
                portName: "",
                updatedAt: "",
                syncStatus: "UNHEALTHY",
                measurements: {},
                sensorModelInfo: {}
            }
        }
    },
    [ModalTypes.HOUSE_SECTION_SENSOR_GRAPH]: {
        isVisible: false,
        data: {
            houseId: "",
            houseSectionId: "",
            houseSectionSensorId: ""
        }
    },

    // organization
    [ModalTypes.ORGANIZATION_CREATE]: {
        isVisible: false,
        data: {}
    },
};

export const ModalContext = React.createContext<IModalContext>({
    modalState: initialModalState,
    openModal: ({name, data}) => {
        console.log("Opening modal:", name, "with data:", data);
    },
    closeModal: ({name}) => {
        console.log("Closing modal:", name);
    },
});

export type IOpenModal<T extends ModalTypes> = {
    name: T;
    data?: IModal[T]['data'];
}

export type ICloseModal = {
    name: ModalTypes;
}

export function ModalProvider({children}: { children: ReactNode }) {
    const [modalState, setModalState] = useState<IModal>(initialModalState);

    const openModal: IModalContext["openModal"] = ({name, data}) => {
        setModalState((prev) => ({
            ...prev,
            [name]: {isVisible: true, data: data ?? {}},
        }));
    };

    const closeModal: IModalContext["closeModal"] = ({name}) => {
        setModalState((prev) => ({
            ...prev,
            [name]: {isVisible: false, data: initialModalState[name].data}, // 기본 상태로 복원합니다.
        }));
    };

    const contextValue = {
        modalState,
        openModal,
        closeModal,
    }

    return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
}