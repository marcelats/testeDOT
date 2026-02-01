package com.asda;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 *
 * @author Felipe Osorio Thomé
 */
public interface Command {

    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
            throws CommandException, ServletException, IOException;
    
}
