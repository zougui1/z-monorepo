import {
  IsAlpha as IsAlpha_,
  IsAlphanumeric as IsAlphanumeric_,
  IsArray as IsArray_,
  IsAscii as IsAscii_,
  IsBIC as IsBIC_,
  IsBase32 as IsBase32_,
  IsBase64 as IsBase64_,
  IsBoolean as IsBoolean_,
  IsBooleanString as IsBooleanString_,
  IsBtcAddress as IsBtcAddress_,
  IsByteLength as IsByteLength_,
  IsCreditCard as IsCreditCard_,
  IsCurrency as IsCurrency_,
  IsDataURI as IsDataURI_,
  IsDate as IsDate_,
  IsDateString as IsDateString_,
  IsDecimal as IsDecimal_,
  IsDefined as IsDefined_,
  IsDivisibleBy as IsDivisibleBy_,
  IsEAN as IsEAN_,
  IsEmail as IsEmail_,
  IsEmpty as IsEmpty_,
  IsEnum as IsEnum_,
  IsEthereumAddress as IsEthereumAddress_,
  IsFQDN as IsFQDN_,
  IsFirebasePushId as IsFirebasePushId_,
  IsFullWidth as IsFullWidth_,
  IsHSL as IsHSL_,
  IsHalfWidth as IsHalfWidth_,
  IsHash as IsHash_,
  IsHexColor as IsHexColor_,
  IsHexadecimal as IsHexadecimal_,
  IsIBAN as IsIBAN_,
  IsIP as IsIP_,
  IsISBN as IsISBN_,
  IsISIN as IsISIN_,
  IsISO31661Alpha2 as IsISO31661Alpha2_,
  IsISO31661Alpha3 as IsISO31661Alpha3_,
  IsISO8601 as IsISO8601_,
  IsISRC as IsISRC_,
  IsISSN as IsISSN_,
  IsIdentityCard as IsIdentityCard_,
  IsIn as IsIn_,
  IsInstance as IsInstance_,
  IsInt as IsInt_,
  IsJSON as IsJSON_,
  IsJWT as IsJWT_,
  IsLatLong as IsLatLong_,
  IsLatitude as IsLatitude_,
  IsLocale as IsLocale_,
  IsLongitude as IsLongitude_,
  IsLowercase as IsLowercase_,
  IsMACAddress as IsMACAddress_,
  IsMagnetURI as IsMagnetURI_,
  IsMilitaryTime as IsMilitaryTime_,
  IsMimeType as IsMimeType_,
  IsMobilePhone as IsMobilePhone_,
  IsMongoId as IsMongoId_,
  IsMultibyte as IsMultibyte_,
  IsNegative as IsNegative_,
  IsNotEmpty as IsNotEmpty_,
  IsNotEmptyObject as IsNotEmptyObject_,
  IsNotIn as IsNotIn_,
  IsNumber as IsNumber_,
  IsNumberString as IsNumberString_,
  IsObject as IsObject_,
  IsOctal as IsOctal_,
  IsOptional as IsOptional_,
  IsPassportNumber as IsPassportNumber_,
  IsPhoneNumber as IsPhoneNumber_,
  IsPort as IsPort_,
  IsPositive as IsPositive_,
  IsPostalCode as IsPostalCode_,
  IsRFC3339 as IsRFC3339_,
  IsRgbColor as IsRgbColor_,
  IsSemVer as IsSemVer_,
  IsString as IsString_,
  IsSurrogatePair as IsSurrogatePair_,
  IsUUID as IsUUID_,
  IsUppercase as IsUppercase_,
  IsUrl as IsUrl_,
  IsVariableWidth as IsVariableWidth_,
} from 'class-validator';
import type {
  IsISBNVersion as IsISBNVersion_,
  IsIpVersion as IsIpVersion_,
  IsNumberOptions as IsNumberOptions_,
  ValidationOptions as ValidationOptions_,
  UUIDVersion,
} from 'class-validator';
import type { CountryCode } from 'libphonenumber-js';

import { i18Msg } from './i18Msg';

export interface ValidationOptions extends Omit<ValidationOptions_, 'message'> {

}

export function IsAlpha(locale?: string | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsAlpha_(locale, { ...validationOptions, message: i18Msg('validation.isAlpha', { locale }) });
}

export function IsAlphanumeric(locale?: string | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsAlphanumeric_(locale, { ...validationOptions, message: i18Msg('validation.isAlphanumeric', { locale }) });
}

export function IsArray(validationOptions?: ValidationOptions | undefined) {
  return IsArray_({ ...validationOptions, message: i18Msg('validation.isArray') });
}

export function IsAscii(validationOptions?: ValidationOptions | undefined) {
  return IsAscii_({ ...validationOptions, message: i18Msg('validation.isAscii') });
}

export function IsBIC(validationOptions?: ValidationOptions | undefined) {
  return IsBIC_({ ...validationOptions, message: i18Msg('validation.isBIC') });
}

export function IsBase32(validationOptions?: ValidationOptions | undefined) {
  return IsBase32_({ ...validationOptions, message: i18Msg('validation.isBase32') });
}

export function IsBase64(validationOptions?: ValidationOptions | undefined) {
  return IsBase64_({ ...validationOptions, message: i18Msg('validation.isBase64') });
}

export function IsBoolean(validationOptions?: ValidationOptions | undefined) {
  return IsBoolean_({ ...validationOptions, message: i18Msg('validation.isBoolean') });
}

export function IsBooleanString(validationOptions?: ValidationOptions | undefined) {
  return IsBooleanString_({ ...validationOptions, message: i18Msg('validation.isBooleanString') });
}

export function IsBtcAddress(validationOptions?: ValidationOptions | undefined) {
  return IsBtcAddress_({ ...validationOptions, message: i18Msg('validation.isBtcAddress') });
}

export function IsByteLength(min: number, max?: number | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsByteLength_(min, max, { ...validationOptions, message: i18Msg('validation.isByteLength', { min, max }) });
}

export function IsCreditCard(validationOptions?: ValidationOptions | undefined) {
  return IsCreditCard_({ ...validationOptions, message: i18Msg('validation.isCreditCard') });
}

export function IsCurrency(validationOptions?: ValidationOptions | undefined) {
  return IsCurrency_({ ...validationOptions, message: i18Msg('validation.isCurrency') });
}

export function IsDataURI(validationOptions?: ValidationOptions | undefined) {
  return IsDataURI_({ ...validationOptions, message: i18Msg('validation.isDataURI') });
}

export function IsDate(validationOptions?: ValidationOptions | undefined) {
  return IsDate_({ ...validationOptions, message: i18Msg('validation.isDate') });
}

export function IsDateString(validationOptions?: ValidationOptions | undefined) {
  return IsDateString_({ ...validationOptions, message: i18Msg('validation.isDateString') });
}

export function IsDecimal(validationOptions?: ValidationOptions | undefined) {
  return IsDecimal_({ ...validationOptions, message: i18Msg('validation.isDecimal') });
}

export function IsDefined(validationOptions?: ValidationOptions | undefined) {
  return IsDefined_({ ...validationOptions, message: i18Msg('validation.isDefined') });
}

export function IsDivisibleBy(num: number, validationOptions?: ValidationOptions | undefined) {
  return IsDivisibleBy_(num, { ...validationOptions, message: i18Msg('validation.isDivisibleBy', { number: num }) });
}

export function IsEAN(validationOptions?: ValidationOptions | undefined) {
  return IsEAN_({ ...validationOptions, message: i18Msg('validation.isEAN') });
}

export function IsEmail(validationOptions?: ValidationOptions | undefined) {
  return IsEmail_({ ...validationOptions, message: i18Msg('validation.isEmail') });
}

export function IsEmpty(validationOptions?: ValidationOptions | undefined) {
  return IsEmpty_({ ...validationOptions, message: i18Msg('validation.isEmpty') });
}

export function IsEnum(validationOptions?: ValidationOptions | undefined) {
  return IsEnum_({ ...validationOptions, message: i18Msg('validation.isEnum') });
}

export function IsEthereumAddress(validationOptions?: ValidationOptions | undefined) {
  return IsEthereumAddress_({ ...validationOptions, message: i18Msg('validation.isEthereumAddress') });
}

export function IsFQDN(validationOptions?: ValidationOptions | undefined) {
  return IsFQDN_({ ...validationOptions, message: i18Msg('validation.isFQDN') });
}

export function IsFirebasePushId(validationOptions?: ValidationOptions | undefined) {
  return IsFirebasePushId_({ ...validationOptions, message: i18Msg('validation.isFirebasePushId') });
}

export function IsFullWidth(validationOptions?: ValidationOptions | undefined) {
  return IsFullWidth_({ ...validationOptions, message: i18Msg('validation.isFullWidth') });
}

export function IsHSL(validationOptions?: ValidationOptions | undefined) {
  return IsHSL_({ ...validationOptions, message: i18Msg('validation.isHSL') });
}

export function IsHalfWidth(validationOptions?: ValidationOptions | undefined) {
  return IsHalfWidth_({ ...validationOptions, message: i18Msg('validation.isHalfWidth') });
}

export function IsHash(algorithm: string, validationOptions?: ValidationOptions | undefined) {
  return IsHash_(algorithm, { ...validationOptions, message: i18Msg('validation.isHash', { algorithm }) });
}

export function IsHexColor(validationOptions?: ValidationOptions | undefined) {
  return IsHexColor_({ ...validationOptions, message: i18Msg('validation.isHexColor') });
}

export function IsHexadecimal(validationOptions?: ValidationOptions | undefined) {
  return IsHexadecimal_({ ...validationOptions, message: i18Msg('validation.isHexadecimal') });
}

export function IsIBAN(validationOptions?: ValidationOptions | undefined) {
  return IsIBAN_({ ...validationOptions, message: i18Msg('validation.isIBAN') });
}

export function IsIP(version?: IsIpVersion_ | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsIP_(version, { ...validationOptions, message: i18Msg('validation.isIP', { version }) });
}

export function IsISBN(version?: IsISBNVersion_ | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsISBN_(version, { ...validationOptions, message: i18Msg('validation.isISBN', { version }) });
}

export function IsISIN(validationOptions?: ValidationOptions | undefined) {
  return IsISIN_({ ...validationOptions, message: i18Msg('validation.isISIN') });
}

export function IsISO31661Alpha2(validationOptions?: ValidationOptions | undefined) {
  return IsISO31661Alpha2_({ ...validationOptions, message: i18Msg('validation.isISO31661Alpha2') });
}

export function IsISO31661Alpha3(validationOptions?: ValidationOptions | undefined) {
  return IsISO31661Alpha3_({ ...validationOptions, message: i18Msg('validation.isISO31661Alpha3') });
}

export function IsISO8601(validationOptions?: ValidationOptions | undefined) {
  return IsISO8601_({ ...validationOptions, message: i18Msg('validation.isISO8601') });
}

export function IsISRC(validationOptions?: ValidationOptions | undefined) {
  return IsISRC_({ ...validationOptions, message: i18Msg('validation.isISRC') });
}

export function IsISSN(validationOptions?: ValidationOptions | undefined) {
  return IsISSN_({ ...validationOptions, message: i18Msg('validation.isISSN') });
}

export function IsIdentityCard(validationOptions?: ValidationOptions | undefined) {
  return IsIdentityCard_({ ...validationOptions, message: i18Msg('validation.isIdentityCard') });
}

export function IsIn(values: readonly any[], validationOptions?: ValidationOptions | undefined) {
  return IsIn_(values, { ...validationOptions, message: i18Msg('validation.isIn', { values }) });
}

export function IsInstance(targetType: new (...args: any[]) => any, validationOptions?: ValidationOptions | undefined) {
  return IsInstance_(targetType, { ...validationOptions, message: i18Msg('validation.isInstance', { targetType }) });
}

export function IsInt(validationOptions?: ValidationOptions | undefined) {
  return IsInt_({ ...validationOptions, message: i18Msg('validation.isInt') });
}

export function IsJSON(validationOptions?: ValidationOptions | undefined) {
  return IsJSON_({ ...validationOptions, message: i18Msg('validation.isJSON') });
}

export function IsJWT(validationOptions?: ValidationOptions | undefined) {
  return IsJWT_({ ...validationOptions, message: i18Msg('validation.isJWT') });
}

export function IsLatLong(validationOptions?: ValidationOptions | undefined) {
  return IsLatLong_({ ...validationOptions, message: i18Msg('validation.isLatLong') });
}

export function IsLatitude(validationOptions?: ValidationOptions | undefined) {
  return IsLatitude_({ ...validationOptions, message: i18Msg('validation.isLatitude') });
}

export function IsLocale(validationOptions?: ValidationOptions | undefined) {
  return IsLocale_({ ...validationOptions, message: i18Msg('validation.isLocale') });
}

export function IsLongitude(validationOptions?: ValidationOptions | undefined) {
  return IsLongitude_({ ...validationOptions, message: i18Msg('validation.isLongitude') });
}

export function IsLowercase(validationOptions?: ValidationOptions | undefined) {
  return IsLowercase_({ ...validationOptions, message: i18Msg('validation.isLowercase') });
}

export function IsMACAddress(validationOptions?: ValidationOptions | undefined) {
  return IsMACAddress_({ ...validationOptions, message: i18Msg('validation.isMACAddress') });
}

export function IsMagnetURI(validationOptions?: ValidationOptions | undefined) {
  return IsMagnetURI_({ ...validationOptions, message: i18Msg('validation.isMagnetURI') });
}

export function IsMilitaryTime(validationOptions?: ValidationOptions | undefined) {
  return IsMilitaryTime_({ ...validationOptions, message: i18Msg('validation.isMilitaryTime') });
}

export function IsMimeType(validationOptions?: ValidationOptions | undefined) {
  return IsMimeType_({ ...validationOptions, message: i18Msg('validation.isMimeType') });
}

export function IsMobilePhone(validationOptions?: ValidationOptions | undefined) {
  return IsMobilePhone_({ ...validationOptions, message: i18Msg('validation.isMobilePhone') });
}

export function IsMongoId(validationOptions?: ValidationOptions | undefined) {
  return IsMongoId_({ ...validationOptions, message: i18Msg('validation.isMongoId') });
}

export function IsMultibyte(validationOptions?: ValidationOptions | undefined) {
  return IsMultibyte_({ ...validationOptions, message: i18Msg('validation.isMultibyte') });
}

export function IsNegative(validationOptions?: ValidationOptions | undefined) {
  return IsNegative_({ ...validationOptions, message: i18Msg('validation.isNegative') });
}

export function IsNotEmpty(validationOptions?: ValidationOptions | undefined) {
  return IsNotEmpty_({ ...validationOptions, message: i18Msg('validation.isNotEmpty') });
}

export function IsNotEmptyObject(options?: IsNotEmptyObjectOptions | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsNotEmptyObject_(options, { ...validationOptions, message: i18Msg('validation.isNotEmptyObject', { options }) });
}

export function IsNotIn(values: readonly any[], validationOptions?: ValidationOptions | undefined) {
  return IsNotIn_(values, { ...validationOptions, message: i18Msg('validation.isNotIn', { values }) });
}

export function IsNumber(options?: IsNumberOptions_ | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsNumber_(options, { ...validationOptions, message: i18Msg('validation.isNumber', { options }) });
}

export function IsNumberString(validationOptions?: ValidationOptions | undefined) {
  return IsNumberString_({ ...validationOptions, message: i18Msg('validation.isNumberString') });
}

export function IsObject(validationOptions?: ValidationOptions | undefined) {
  return IsObject_({ ...validationOptions, message: i18Msg('validation.isObject') });
}

export function IsOctal(validationOptions?: ValidationOptions | undefined) {
  return IsOctal_({ ...validationOptions, message: i18Msg('validation.isOctal') });
}

export function IsOptional(validationOptions?: ValidationOptions | undefined) {
  return IsOptional_({ ...validationOptions, message: i18Msg('validation.isOptional') });
}

export function IsPassportNumber(countryCode: string, validationOptions?: ValidationOptions | undefined) {
  return IsPassportNumber_(countryCode, { ...validationOptions, message: i18Msg('validation.isPassportNumber', { countryCode }) });
}

export function IsPhoneNumber(region?: CountryCode | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsPhoneNumber_(region, { ...validationOptions, message: i18Msg('validation.isPhoneNumber', { region }) });
}

export function IsPort(validationOptions?: ValidationOptions | undefined) {
  return IsPort_({ ...validationOptions, message: i18Msg('validation.isPort') });
}

export function IsPositive(validationOptions?: ValidationOptions | undefined) {
  return IsPositive_({ ...validationOptions, message: i18Msg('validation.isPositive') });
}

export function IsPostalCode(validationOptions?: ValidationOptions | undefined) {
  return IsPostalCode_({ ...validationOptions, message: i18Msg('validation.isPostalCode') });
}

export function IsRFC3339(validationOptions?: ValidationOptions | undefined) {
  return IsRFC3339_({ ...validationOptions, message: i18Msg('validation.isRFC3339') });
}

export function IsRgbColor(includePercentValues?: boolean | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsRgbColor_(includePercentValues, { ...validationOptions, message: i18Msg('validation.isRgbColor', { includePercentValues }) });
}

export function IsSemVer(validationOptions?: ValidationOptions | undefined) {
  return IsSemVer_({ ...validationOptions, message: i18Msg('validation.isSemVer') });
}

export function IsString(validationOptions?: ValidationOptions | undefined) {
  return IsString_({ ...validationOptions, message: i18Msg('validation.isString') });
}

export function IsSurrogatePair(validationOptions?: ValidationOptions | undefined) {
  return IsSurrogatePair_({ ...validationOptions, message: i18Msg('validation.isSurrogatePair') });
}

export function IsUUID(version?: UUIDVersion | undefined, validationOptions?: ValidationOptions | undefined) {
  return IsUUID_(version, { ...validationOptions, message: i18Msg('validation.isUUID', { version }) });
}

export function IsUppercase(validationOptions?: ValidationOptions | undefined) {
  return IsUppercase_({ ...validationOptions, message: i18Msg('validation.isUppercase') });
}

export function IsUrl(validationOptions?: ValidationOptions | undefined) {
  return IsUrl_({ ...validationOptions, message: i18Msg('validation.isUrl') });
}

export function IsVariableWidth(validationOptions?: ValidationOptions | undefined) {
  return IsVariableWidth_({ ...validationOptions, message: i18Msg('validation.isVariableWidth') });
}

export interface IsNotEmptyObjectOptions {
  nullable?: boolean | undefined;
}
