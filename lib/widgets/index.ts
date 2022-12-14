import { CustomisableUIWidgetConfigurationTypes } from "../CustomisableUIWidgets";
import Widget from "./common";
import BackButtonWidget from "./navigation/back-button";

export const applyConfig = (
    widgetClass: Widget,
    widgetOptions: Partial<Widget> | undefined
) => {
    if (
        !widgetClass ||
        !widgetOptions ||
        (widgetOptions && !Object.keys(widgetOptions).length)
    )
        return;

    for (const kv of Object.entries(widgetOptions)) {
        const key = kv[0] as string;
        const value = kv[1] as any;

        if (key.charAt(0) == "_") {
            // Property is private and shouldn't be modified
            continue;
        }

        (widgetClass as any)[key] = value;
    }
};

export const applyWidgetConfiguration = <T extends Widget>(
    widgetClass: T,
    allowedParameters: {
        [key: string]: CustomisableUIWidgetConfigurationTypes[];
    },
    options: Partial<T>
) => {
    const widgetKeys = Object.keys(widgetClass);
    const allowedKeys = new Map<
        string,
        CustomisableUIWidgetConfigurationTypes[]
    >();

    for (const key of Object.keys(allowedParameters)) {
        if (widgetKeys.includes(key)) {
            allowedKeys.set(key, allowedParameters[key]);
        }
    }

    for (const [key, value] of Object.entries(options)) {
        if (
            allowedKeys.has(key) &&
            allowedKeys.get(key)?.includes(typeof value as any)
        ) {
            (widgetClass as any)[key] = value;
        } else {
            console.error(
                `Disallowed type used for ${key} on widget ${Widget.name}`
            );
            return;
        }
    }
};

export const CustomizableWidgets: Set<Widget> = new Set();

CustomizableWidgets.add(new BackButtonWidget());
