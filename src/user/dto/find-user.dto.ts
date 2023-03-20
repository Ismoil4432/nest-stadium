export class FindUserDto {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    phone?: string;
    birth_day_from?: Date;
    birth_day_to?: Date;
    is_owner?: boolean;
    is_active?: boolean;
}