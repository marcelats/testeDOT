package com.asda.model.accountsCommands;

import com.asda.beans.AccountBean;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import java.util.Calendar;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 *
 * @author Felipe Osorio Thomé
 * @author Marcela Tiemi Shinzato
 */
public class SignInCommand implements Command {

    private static final String PERSISTENCE_UNIT = "ASDA_JSPPU";
    private CommandResponse aResponse;
    private EntityManagerFactory factory;
    private EntityManager manager;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res)
        throws CommandException {
            AccountBean account = new AccountBean();

            if(!req.getParameter("si-name").equals("")) {
                account.setName(req.getParameter("si-name"));
            }
            if(!req.getParameter("si-email").equals("")) {
                account.setEmail(req.getParameter("si-email"));
            }
            if(!req.getParameter("si-course").equals("")) {
                account.setCourse(req.getParameter("si-course"));
            }
            if(!req.getParameter("si-class").equals("")) {
                account.setUserClass(req.getParameter("si-class"));
            }
            if(!req.getParameter("si-password").equals("")) {
                account.setPasswordHash(req.getParameter("si-password"));
            }
            account.setRegistrationDate(Calendar.getInstance());

            factory = Persistence.createEntityManagerFactory(PERSISTENCE_UNIT);
            manager = factory.createEntityManager();

            manager.getTransaction().begin();
            manager.persist(account);
            manager.getTransaction().commit();

            manager.close();
            factory.close();

            return aResponse;
        }
}