import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
} from '@casl/ability';
import { InvoiceEntity } from 'src/schema/invoice.entity';
import { UserEntity } from 'src/schema/user.entity';
import { CaslActions } from 'src/utils/casl';

type Subjects = InferSubjects<typeof UserEntity | typeof InvoiceEntity> | 'all';
type InvoiceAbility = Ability<[CaslActions | 'pay', Subjects]>;

export function invoiceDefineAbilityFor(user: UserEntity) {
  const { can, build } = new AbilityBuilder<InvoiceAbility>(
    Ability as AbilityClass<InvoiceAbility>,
  );
  can('pay', InvoiceEntity, { 'user.id': user.id } as any);
  return build();
}
