export const CoreEvent = {
    STATE_CHANGED: 'core:state-changed',
    PANE_INITIALIZED: 'core:pane.initialized',
    PANE_ACTIVATED: 'core:pane.activated',
    PANE_SPLITTED: 'core:pane.splitted',
    PANE_CLOSED: 'core:pane.closed',
    TAB_OPENED: 'core:tab.opened',
    TAB_CLOSED: 'core:tab.closed',
    TAB_ACTIVATED: 'core:tab.activated',
    TAB_STATE_CHANGED: 'core:tab.stateChanged',
} as const;

export const CoreContext = {
    PANE_IS_SPLIT: 'pane.isSplit',
} as const;

export const CoreCommand = {
    PANE_SPLIT_HORIZONTAL: 'core.pane.split-horizontal',
    PANE_SPLIT_VERTICAL: 'core.pane.split-vertical',
    PANE_CLOSE: 'core.pane.close',
    SAVE_TAB: 'core.saveTab',
    COMMAND_PALETTE_SHOW: 'core.commandPalette.show',
} as const;