package com.asda.model.asdaCommands;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import jakarta.persistence.*;
import com.asda.Command;
import com.asda.CommandException;
import com.asda.CommandResponse;
import com.asda.beans.AccountBean;
import com.asda.controller.asda.JpaContextListener;
import com.asda.model.accountsCommands.UserSessionManager;

import java.io.IOException;


@WebServlet("/verify")
public class VerificarGraphServlet extends HttpServlet implements Command {

    private CommandResponse aResponse;

    private EntityManager em;

    @Override
    public CommandResponse execute(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException, CommandException {
        

HttpSession session = req.getSession();
        UserSessionManager sessionMgr = UserSessionManager.getInstance();
        AccountBean account = sessionMgr.getAccountUser(session);

   
        if (req.getParameter("filename") != null) {
            String filename = req.getParameter("filename");
            String graphJson = req.getParameter("graphJson");

            em = JpaContextListener.getEmf().createEntityManager();
            
        try {
            em.getTransaction().begin();
System.out.println("filename: " + filename);
System.out.println("graphJson: " + graphJson);
System.out.println("user ID: " + account);

em.createNativeQuery(
    "INSERT INTO graphs (graph_name, graph_json, user_id, publicGraph) " +
    "VALUES (:filename, :graphJson, :user, false) " +
    "ON CONFLICT (user_id, graph_name) DO UPDATE " +
    "SET graph_json = :graphJson, user_id = :user, publicGraph = false"
)
.setParameter("filename", filename)
.setParameter("graphJson", graphJson)
.setParameter("user", account.getUserId()) // <- deve ser ID
.executeUpdate(); // <- ESSENCIAL

em.getTransaction().commit();
em.close();


return aResponse; // Se você já respondeu direto, não precisa retornar um CommandResponse

        } catch (NoResultException e) {

            throw new CommandException("The graph name is invalid.");

        } catch (Exception e) {

            e.printStackTrace();
            throw new CommandException("An error occurred.");
        }
        finally{em.close();}
   
    }return null;

    }}
