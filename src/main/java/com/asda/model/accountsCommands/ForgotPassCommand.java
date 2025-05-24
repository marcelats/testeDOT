package com.asda.model.accountsCommands;

import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 *
 * @author Felipe Osorio Thomé
 */
public class ForgotPassCommand implements Command {

    private CommandResponse aResponse;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException {
        return null;
    }
}