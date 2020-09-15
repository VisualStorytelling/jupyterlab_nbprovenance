import { EventConfig } from '../Utils/EventConfig';
import { BundleMap } from '../Utils/BundleMap';
import { Provenance, ProvenanceGraph, NodeID } from '@visdesignlab/trrack';
export interface ProvVisConfig {
    eventConfig?: EventConfig<any>;
    editAnnotations?: boolean;
    bundleMap?: BundleMap;
    iconOnly?: boolean;
    iconSize?: number;
    height?: number;
    width?: number;
    sideOffset?: number;
    backboneGutter?: number;
    gutter?: number;
    verticalSpace?: number;
    regularCircleRadius?: number;
    backboneCircleRadius?: number;
    regularCircleStroke?: number;
    backboneCircleStroke?: number;
    topOffset?: number;
    textSize?: number;
    linkWidth?: number;
    duration?: number;
    cellsVisArea?: number;
    legend?: boolean;
    filters?: boolean;
}
export declare function ProvVisCreator<T, S extends string, A>(node: Element, prov: Provenance<T, S, A>, callback?: (id: NodeID) => void, buttons?: boolean, ephemeralUndo?: boolean, fauxRoot?: NodeID, config?: Partial<ProvVisConfig>): void;
export declare function UndoRedoButtonCreator<T, S extends string, A>(node: Element, graph: ProvenanceGraph<T, S, A>, undoCallback: () => void, redoCallback: () => void): void;
