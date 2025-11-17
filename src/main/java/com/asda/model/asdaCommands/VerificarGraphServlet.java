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
            String gv_file = req.getParameter("gv_file");
            String code_file = req.getParameter("code_file");
            String code_name = req.getParameter("code_name");
            String report_file = req.getParameter("report_file");
            String report_name = req.getParameter("report_name");
            em = JpaContextListener.getEmf().createEntityManager();
            
            try {
                em.getTransaction().begin();
                System.out.println("filename: " + filename);
                System.out.println("graphJson: " + graphJson);
                System.out.println("user ID: " + account);
                System.out.println(gv_file);
                System.out.println(code_file);
                System.out.println(code_name);
                System.out.println(report_file);
                System.out.println(report_name);

                em.createNativeQuery(
                    "INSERT INTO graphs (graph_name, graph_json, user_id, publicGraph, gv, code, report, report_name, code_name) " +
                    "VALUES (:filename, :graphJson, :user, false, :gv, :code, :report, :report_name, :code_name) " +
                    "ON CONFLICT (user_id, graph_name) DO UPDATE " +
                    "SET graph_json = :graphJson, user_id = :user, publicGraph = false, gv = :gv, code = :code, report = :report, report_name = :report_name, code_name = :code_name"
                )
                .setParameter("filename", filename)
                .setParameter("graphJson", graphJson)
                .setParameter("user", account.getUserId()) // <- deve ser ID
                .setParameter("gv", gv_file)
                .setParameter("code", code_file)
                .setParameter("report", report_file)
                .setParameter("report_name", report_name)
                .setParameter("code_name", code_name)
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
            finally{
                em.close();
            }
   
        }
        return null;
    }
}
