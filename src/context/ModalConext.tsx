'use client'

import React, {ReactNode, useState} from "react";

interface IModalContext {
    modalState: IModal;
    openModal: ({name, data}: IOpenModal) => void;
    closeModal: ({name}: IOpenClose) => void;
}

export const ModalContext = React.createContext<IModalContext>({
    modalState: {},
    openModal: ({name, data}) => {
        console.log("Opening modal:", name, "with data:", data);
    },
    closeModal: ({name}) => {
        console.log("Closing modal:", name);
    },
});

export type IOpenModal = {
    name: string
    data?: string
}

export type IOpenClose = {
    name: string
}

interface IModal {
    [key: string]: {
        isVisible?: boolean;
        data?: string;
    };
}

export function ModalProvider({children}: { children: ReactNode }) {
    const [modalState, setModalState] = useState<IModal>({});

    const openModal = ({name, data}: IOpenModal) => {
        setModalState((prev) => ({
            ...prev,
            [name]: {isVisible: true, data},
        }));
    }

    const closeModal = ({name}: IOpenClose) => {
        setModalState((prev) => ({
            ...prev,
            [name]: {isVisible: false, data: undefined},
        }));
    };

    const contextValue = {
        modalState,
        openModal,
        closeModal,
    }

    return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
}

export const ModalTypes = Object.freeze({
    // organization
    ORGANIZATION_CREATE: "ORGANIZATION_CREATE",
    ORGANIZATION_MEMBER_CREATE: "ORGANIZATION_MEMBER_CREATE",
    ORGANIZATION_HOUSE_CREATE: "ORGANIZATION_HOUSE_CREATE",

    // greenHouse
    GREENHOUSE_CREATE: "GREENHOUSE_CREATE",
    GREENHOUSE_SECTION_CREATE: "GREENHOUSE_SECTION_CREATE",
    GREENHOUSE_SECTION_SENSOR_CREATE: "GREENHOUSE_SECTION_SENSOR_CREATE",

    // measurementType
    MEASUREMENT_TYPE_CREATE: "MEASUREMENT_TYPE_CREATE",

    // dashboard
    DASHBOARD_CREATE: "DASHBOARD_CREATE",
});