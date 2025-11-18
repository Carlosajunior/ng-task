import { SetMetadata } from '@nestjs/common';

/**
 * Key for public route metadata
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark routes as public (bypass authentication)
 * Usage: @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

