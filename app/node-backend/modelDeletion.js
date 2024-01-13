const fs = require('fs');
const path = require('path');

const deleteOldModels = function () {
    const directoryPath = "./models";

    const twentyFourHoursAgo = new Date().getTime() - 24 * 60 * 60 * 1000;

    fs.readdir(directoryPath, function (err, files)
    {
        if (err) 
        {
            console.error('Error reading models-directory:', err);
            return;
        }

        files.forEach(function (file) 
        {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, function (statErr, stats) 
            {
                if (statErr) 
                {
                    console.error('Error getting model stats:', statErr);
                    return;
                }

                const fileCreationTime = new Date(stats.birthtime).getTime();

                if (fileCreationTime < twentyFourHoursAgo) 
                {
                    fs.unlink(filePath, function (unlinkErr) 
                    {
                        if (unlinkErr)
                        {
                            console.error('Error deleting model:', unlinkErr);
                        } else 
                        {
                            console.log(`Deleted model: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
    console.log(`Deleted models older than 24h`);
};

module.exports = deleteOldModels;