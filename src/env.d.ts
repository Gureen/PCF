/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="vite/client" />

/**
 * Type definition for environment variables
 * Extends Vite's ImportMetaEnv interface for type-safe access to environment variables
 */
interface ImportMetaEnv {}

/**
 * Type definition for Vite's import.meta object
 * Provides TypeScript support for accessing environment variables
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}