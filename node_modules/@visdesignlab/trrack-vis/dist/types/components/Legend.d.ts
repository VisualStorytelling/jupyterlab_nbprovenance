/// <reference types="react" />
import { EventConfig } from "../Utils/EventConfig";
interface LegendProps {
    filters?: boolean;
    eventConfig?: EventConfig<string>;
    iconHeight: number;
    iconWidth: number;
}
export declare function Legend({ filters, eventConfig, iconHeight, iconWidth }: LegendProps): JSX.Element;
export {};
