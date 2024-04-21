import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import { InvoiceLogEntity } from 'src/schema/invoice-log.entity';
import { InvoiceEntity } from 'src/schema/invoice.entity';
import { UserEntity } from 'src/schema/user.entity';
import { CaslActions } from 'src/utils/casl';

type Subjects =
  | InferSubjects<
      typeof UserEntity | typeof InvoiceLogEntity | typeof InvoiceEntity
    >
  | 'all';
type InvoiceAbility = Ability<[CaslActions | 'pay', Subjects]>;

export function invoiceLogDefineAbilityFor(user: UserEntity) {
  const { can, build } = new AbilityBuilder<InvoiceAbility>(
    Ability as AbilityClass<InvoiceAbility>,
  );
  can('read', InvoiceEntity, { user: { id: user.id } });
  return build();
}
