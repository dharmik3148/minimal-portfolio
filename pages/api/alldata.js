import prisma from "@/lib/prisma";
import shuffleArray from "@/utils/helper";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const homepage = await prisma.homepage.findMany();
      const work = await prisma.project.findMany({
        select: {
          title: true,
          details: true,
          github: true,
          livedemo: true,
          tags: true,
          images: { select: { id: true, path: true } },
        },
      });

      const shuffledWork = shuffleArray(work);

      const parseDate = (text) => {
        const [month, year] = text.split(" ");
        return new Date(`${month} 1, ${year}`);
      };

      const sortExperienceByStartDate = (arr) => {
        return arr.sort((a, b) => {
          const startA = parseDate(a.duration.split(" - ")[0]);
          const startB = parseDate(b.duration.split(" - ")[0]);
          return startB - startA;
        });
      };

      const experience = await prisma.experience.findMany();
      const sortedExperience = sortExperienceByStartDate(experience);

      const achievements = await prisma.achievement.findMany({
        orderBy: {
          date: "desc",
        },
      });
      const skills = await prisma.skills.findMany();

      const groupedSkills = Object.values(
        skills.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = {
              category: skill.category,
              skills: [],
            };
          }
          acc[skill.category].skills.push({
            id: skill.id,
            skillname: skill.skillname,
            logopath: skill.logopath,
          });
          return acc;
        }, {})
      );
      const contact = await prisma.contact.findMany({
        select: {
          title: true,
          value: true,
          iconName: true,
        },
      });

      return res.status(200).send({
        status: true,
        message: "success",
        homepage: homepage[0] || [],
        work: shuffledWork,
        experience: sortedExperience,
        achievements,
        skill: groupedSkills,
        contact,
      });
    } catch (error) {
      return res
        .status(200)
        .send({ status: false, message: "Something went wrong" });
    }
  } else {
    return res
      .status(200)
      .send({ status: false, message: "Something went wrong" });
  }
}
