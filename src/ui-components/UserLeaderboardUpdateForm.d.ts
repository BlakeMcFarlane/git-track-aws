/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserLeaderboardUpdateFormInputValues = {
    name?: string;
    score?: number;
};
export declare type UserLeaderboardUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    score?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserLeaderboardUpdateFormOverridesProps = {
    UserLeaderboardUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    score?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UserLeaderboardUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserLeaderboardUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    userLeaderboard?: any;
    onSubmit?: (fields: UserLeaderboardUpdateFormInputValues) => UserLeaderboardUpdateFormInputValues;
    onSuccess?: (fields: UserLeaderboardUpdateFormInputValues) => void;
    onError?: (fields: UserLeaderboardUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UserLeaderboardUpdateFormInputValues) => UserLeaderboardUpdateFormInputValues;
    onValidate?: UserLeaderboardUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserLeaderboardUpdateForm(props: UserLeaderboardUpdateFormProps): React.ReactElement;
