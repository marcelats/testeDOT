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
/**
 *
 * @author Marcela Tiemi Shinzato
 */
@WebServlet("/saveAs")
public class SaveGraph extends HttpServlet implements Command {

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
            String gvFile = req.getParameter("gvFile");
            String codeFile = req.getParameter("codeFile");
            String codeName = req.getParameter("codeName");
            String reportFile = req.getParameter("reportFile");
            String reportName = req.getParameter("reportName");
            em = JpaContextListener.getEmf().createEntityManager();
            
            try {
                em.getTransaction().begin();
                em.createNativeQuery(
                    "INSERT INTO graphs (graph_name, graph_json, user_id, publicGraph, gv, code, report, report_name, code_name) " +
                    "VALUES (:filename, :graphJson, :user, false, :gv, :code, :report, :reportName, :codeName)"
                )
                .setParameter("filename", filename)
                .setParameter("graphJson", graphJson)
                .setParameter("user", account.getUserId()) 
                .setParameter("gv", gvFile)
                .setParameter("code", codeFile)
                .setParameter("report", reportFile)
                .setParameter("reportName", reportName)
                .setParameter("codeName", codeName)
                .executeUpdate();
                em.getTransaction().commit();
                em.close();
                return aResponse; 
            } catch (NoResultException e) {
                throw new CommandException("The graph name is invalid.");
            } catch (Exception e) {
                e.printStackTrace();
                throw new CommandException("An error occurred.");
            } finally {
                em.close();
            }
        }
        return null;
    }
}
