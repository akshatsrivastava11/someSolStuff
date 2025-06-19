use {
    std::convert::TryInto,
    solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint,
        entrypoint::ProgramResult,
        msg,
        program::invoke,
        program_error::ProgramError,
        pubkey::Pubkey,
        system_instruction,
    },
    borsh::{BorshSerialize, BorshDeserialize}
};

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TransferData {
    pub lamports: u64
}

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let account_iter = &mut accounts.iter();
    let payer = next_account_info(account_iter)?;
    let payee = next_account_info(account_iter)?;
    
    let transfer_data = TransferData::try_from_slice(instruction_data)?;
    
    // Verify payer signed the transaction
    if !payer.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    invoke(
        &system_instruction::transfer(payer.key, payee.key, transfer_data.lamports),
        &[payer.clone(), payee.clone()]
    )?;
    
    msg!("Transfer completed successfully");
    Ok(())
}