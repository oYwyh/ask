import { FormControl, FormField as CFormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, useController } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type TFormField = {
    form: {
        control: Control<any>;
    };
    name: string,
    placeholder?: string,
    label?: string,
    disabled?: boolean,
    type?: string,
    textarea?: boolean,
    defaultValue?: string | number,
    onUnFocus?: () => void,
    transparent?: boolean,
    maxWords?: number,
    onChangeHandler?: (value: string) => void, // Optional custom onChange handler
}

export default function FormField({
    form,
    name,
    placeholder,
    label,
    disabled,
    type,
    textarea,
    defaultValue,
    onUnFocus,
    transparent,
    maxWords = 255,
    onChangeHandler, // Custom onChange handler
}: TFormField) {
    const {
        field,
        fieldState: { error: fieldError },
    } = useController({
        name,
        control: form.control,
        defaultValue
    });

    const [wordsLeft, setWordsLeft] = useState<number>(maxWords);

    const handleOnChange = (value: string) => {
        if (textarea) {
            if (value.length <= maxWords) {
                setWordsLeft(maxWords - value.length);
            }
        }
        if (onChangeHandler) {
            onChangeHandler(value); // Call the custom onChange handler if provided
        } else {
            field.onChange(value); // Default to react-hook-form's onChange handler
        }
    };

    return (
        <>
            <CFormField
                control={form.control}
                name={name}
                render={({ field: { value } }) => {
                    return (
                        <>
                            <FormItem className="space-y-0 w-[100%]">
                                {!textarea && (
                                    <>
                                        <div className={`flex flex-row gap-2 items-center`}>
                                            {label && (
                                                <FormLabel className="capitalize" hidden={type === 'hidden'}>
                                                    {label || name}
                                                </FormLabel>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input
                                                onChange={(e) => handleOnChange(e.target.value)}
                                                className={`capitalize ${transparent ? "bg-transparent border-0 shadow-md" : ""}`}
                                                disabled={disabled}
                                                value={value}
                                                type={type}
                                                placeholder={placeholder || `Enter ${name}`}
                                                onBlur={onUnFocus}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </>
                                )}
                                {textarea && (
                                    <>
                                        <div className="flex flex-row gap-2 items-center mt-1">
                                            {label && (
                                                <FormLabel className="capitalize" hidden={type === 'hidden'}>
                                                    {label || name}
                                                </FormLabel>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                onChange={(e) => handleOnChange(e.target.value)}
                                                className="capitalize h-fit"
                                                disabled={disabled}
                                                value={value}
                                                placeholder={placeholder || `Enter ${name}`}
                                                onBlur={onUnFocus}
                                                maxLength={maxWords}
                                            />
                                        </FormControl>
                                        <p className="text-right text-xs pt-1">{wordsLeft} characters left</p>
                                        <FormMessage />
                                    </>
                                )}
                            </FormItem >
                        </>
                    )
                }}
            />
        </>
    )
}
