/**
 * TypeScript definitions for Wialon SDK
 * Based on the official Wialon SDK source code
 */

declare global {
  interface Window {
    wialon: typeof W;
    W: typeof W;
  }
}

// Main Wialon namespace
declare namespace W {
  const version: string;
  let debug: boolean;

  // Utility functions
  namespace Util {
    interface Time {
      dstFlags: {
        TZ_DISABLE_DST_BIT: number;
        TZ_TYPE_MASK: number;
        TZ_TYPE_WITH_DST: number;
        TZ_DST_TYPE_MASK: number;
        TZ_DST_TYPE_NONE: number;
        TZ_DST_TYPE_SERVER: number;
        TZ_DST_TYPE_CUSTOM: number;
        TZ_CUSTOM_DST_MASK: number;
        TZ_DST_TYPE_CUSTOM_UTC: number;
        TZ_OFFSET_MASK: number;
      };

      dstRules: {
        DST_MAR2SUN2AM_NOV1SUN2AM: number;
        DST_MAR6SUN_OCT6SUN: number;
        DST_MAR6SUN1AM_OCT6SUN1AM: number;
        DST_MAR6THU_SEP6FRI: number;
        DST_MAR6SUN2AM_OCT6SUN2AM: number;
        DST_MAR30_SEP21: number;
        DST_APR1SUN2AM_OCT6SUN2AM: number;
        DST_APR1_OCT6SUN: number;
        DST_APR6THU_SEP6THU: number;
        DST_APR6THU_UNKNOWN: number;
        DST_APR1_OCT1: number;
        DST_MAR21_22SUN_SEP20_21SUN: number;
        DST_SOUTHERN_SEMISPHERE: number;
        DST_SEP1SUNAFTER7_APR1SUNAFTER5: number;
        DST_SEP1SUN_APR1SUN: number;
        DST_SEP6SUN_APR1SUN: number;
        DST_OCT2SUN_MAR2SUN: number;
        DST_OCT1SUN_FEB3SUN: number;
        DST_OCT3SUN_MAR2SUN: number;
        DST_OCT1SUN_MAR2SUN: number;
        DST_OCT1SUN_APR1SUN: number;
        DST_OCT1SUN_MAR6SUN: number;
        DST_OCT6SUN_JAN6SUN: number;
      };

      getTimeZoneOffset(): number;
      isLeapYear(year: number): boolean;
      getWdayTime(
        year: number,
        month: number,
        weeks: number,
        weekDay: number,
        monthDay?: number,
        hours?: number,
        minutes?: number,
        seconds?: number
      ): number;
      getMonthDays(month: number, year: number): number;
      getYearDays(year: number): number;
    }

    function extend(dest: any, ...sources: any[]): any;
    function create(proto: any): any;
    function stamp(obj: any): number;
    function falseFn(): boolean;
    function formatNum(num: number, digits?: number): number;
    function trim(str: string): string;
    function splitWords(str: string): string[];
    function setOptions(obj: any, options: any): any;
    function getParamString(obj: any, existingUrl?: string, uppercase?: boolean): string;
    function isArray(obj: any): boolean;
    function write(method: string, ...args: any[]): void;

    const time: Time;
    let lastId: number;
  }

  // Event system
  interface Evented {
    on(types: string | Record<string, Function>, fn?: Function, context?: any): this;
    off(types?: string | Record<string, Function>, fn?: Function, context?: any): this;
    fire(type: string, data?: any, propagate?: boolean): this;
    listens(type: string, propagate?: boolean): boolean;
    once(types: string | Record<string, Function>, fn?: Function, context?: any): this;
    addEventParent(obj: any): this;
    removeEventParent(obj: any): this;

    // Aliases
    addEventListener: typeof Evented.prototype.on;
    removeEventListener: typeof Evented.prototype.off;
    addOneTimeEventListener: typeof Evented.prototype.once;
    fireEvent: typeof Evented.prototype.fire;
    hasEventListeners: typeof Evented.prototype.listens;
  }

  // Session class
  interface Session extends Evented {
    options: {
      eventsTimeout: number;
      internalGis?: boolean;
    };

    // Core methods
    execute(method: string, params?: any, callback?: (data: any) => void): void;
    getEvents(): void;
    getBaseUrl(): string;
    getItems(type?: string): any[];
    getItem(id: number): any | null;
    getSid(): string | null;
    getCurrentUser(): any | null;
    getFeatures(): any;
    checkFeature(feature: string): number;

    // Time methods
    getCurrentTime(): number;
    getTimeZone(): number;
    getTimeZoneOffset(tz?: number): number;
    getDSTOffset(absVal: number): number;
    getUserTime(absVal: number, localTimeZone?: boolean): number;

    // Localization
    getLocale(callback: (data: any) => void, force?: boolean): void;
    updateLocale(params: any, callback: (data: any) => void): void;

    // GIS methods
    getBaseGisUrl(gisType: "render" | "search" | "geocode" | "routing"): string;
    getLocations(params: any, force: boolean, callback: (data: any) => void): void;

    // API endpoints
    api: {
      core: {
        login(params: any, callback: (data: any) => void): void;
        logout(callback: (data: any) => void): void;
        use_auth_hash(params: any, callback: (data: any) => void): void;
        duplicate(params: any, callback: (data: any) => void): void;
        update_data_flags(params: any, callback: (data: any) => void): void;
      };
      token: {
        login(params: any, callback: (data: any) => void): void;
      };
    };

    // Private properties (for reference)
    _sid: string | null;
    _url: string;
    _items: Record<number, any>;
    _classes: Record<string, number>;
    _features: any;
    _classItems: Record<number, any[]>;
    _currentUser: any;
    _serverTime: number;
  }

  // Core namespace
  namespace core {
    interface Session {
      getInstance(): Session;
    }

    interface Errors {
      getErrorText(code: number): string;
    }
  }

  // Item namespace
  namespace item {
    interface Item {
      dataFlag: {
        base: number;
      };
    }

    interface Unit {
      dataFlag: {
        sensors: number;
        lastMessage: number;
        lastPosition: number;
      };
    }
  }

  // Class system
  interface Class {
    extend(properties: any): any;
    include(properties: any): this;
    mergeOptions(options: any): this;
  }

  // Request class
  interface Request {
    new (url: string, path?: string, options?: any, counter?: number): Request;
    api(method: string, params: any, callback: (data: any) => void): void;
    send(
      path: string,
      params: any,
      successCallback: (data: any) => void,
      errorCallback?: (data: any) => void
    ): void;
    destroy(): void;
  }

  // Main functions
  function session(url: string, options?: any): Session;
  function extend(dest: any, ...sources: any[]): any;
  function stamp(obj: any): number;
  function setOptions(obj: any, options: any): any;
  function logger(method: string, ...args: any[]): void;

  // Main exports
  const Class: Class;
  const Evented: Class;
  const Session: Class;
  const Request: Request;
  const Mixin: { Events: any };
}
