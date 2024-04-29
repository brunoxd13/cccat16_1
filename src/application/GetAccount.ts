import { AccountRepository } from "../resource/AccountRepository";

export class GetAccount{
  constructor(readonly accountRepository : AccountRepository){

  }

  async execute(input: any) {
    const account = await this.accountRepository.getAccountById(input.accountId);
    return account;
  }
}
